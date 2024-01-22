import { useCallback, useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GetCatalogSwr } from "src/service/use-mongo";
import { GetProductsPaginate } from "src/service/use-shopify";

import {
  Box,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  Slide,
  Collapse,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CatalogInfo from "src/sections/catalog/catalog-info";
import CatalogPriceRule from "src/sections/catalog/catalog-price-rule";
import CatalogSelectedProduct from "src/sections/catalog/catalog-selected-products";
import CatalogProductList from "src/sections/catalog/catalog-products-list";
import TableLoading from "src/components/table-loading";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [cursor, setCursor] = useState({ lastCursor: "" });
  const [pageInfo, setPageInfo] = useState();
  const [productPerPage, setProductPerPage] = useState(10);
  const [editStatus, setEditStatus] = useState(false);
  const { data: session } = useSession();
  const catalogId = router.query?.catalogId;

  const handlePageChange = useCallback(
    async (event, value) => {
      if (value > page) {
        // go to next page
        setCursor({ lastCursor: pageInfo.endCursor });
      } else {
        // go to prev page
        setCursor({ firstCursor: pageInfo.startCursor });
      }
      setPage(value);
    },
    [page, pageInfo]
  );

  const handleRowsPerPageChange = useCallback(async (event) => {
    setPage(0);
    setProductPerPage(event.target.value);
  }, []);

  const {
    data: catalog,
    isLoading,
    isError,
  } = GetCatalogSwr({
    page: 0,
    postPerPage: 1,
    query: { id: catalogId },
  });

  const {
    data: product,
    isLoading: prodLoading,
    isError: prodError,
    mutate
  } = GetProductsPaginate({
    productPerPage,
    catalogId,
    cursor: cursor,
  });

  useEffect(() => {
    if (product) {
      console.log("product", product)
      setPageInfo(product.newData.pageInfo);
    }
  }, [product]);

  return (
    <>
      <Head>
        <title>Catalog | Skratch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <h1 onClick={() => mutate()}>test</h1>
          {catalog && (
            <Box>
              <CatalogInfo session={session} catalog={catalog.data[0]} />
              <CatalogPriceRule session={session} catalog={catalog.data[0]} />
              {prodLoading && <TableLoading />}
              {(prodError || (product && product.newData.totalCount === 0)) && (
                <Typography variant="h5" textAlign={"center"}>
                  No data found!
                </Typography>
              )}
              <Collapse in={!editStatus}>
                {product && product.newData.totalCount > 0 && (
                  <CatalogSelectedProduct
                    prodList={product}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                    handlePageChange={handlePageChange}
                    page={page}
                    productPerPage={productPerPage}
                    productCount={product.newData.totalCount}
                    setEditStatus={setEditStatus}
                  />
                )}
              </Collapse>
              <Collapse in={editStatus}>
                <CatalogProductList catalog={catalog.data[0]} setEditStatus={setEditStatus} productMutate={mutate}/>
              </Collapse>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
