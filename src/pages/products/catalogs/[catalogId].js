import { useCallback, useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GetCatalogSwr } from "src/service/use-mongo";
import { GetProductsPaginate } from "src/service/use-shopify";

import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  Slide,
  Collapse,
  Unstable_Grid2 as Grid,
  Button,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CatalogInfo from "src/sections/catalog/catalog-info";
import CatalogPriceRule from "src/sections/catalog/catalog-price-rule";
import CatalogSelectedProducts from "src/sections/catalog/catalog-selected-products";
import CatalogProductList from "src/sections/catalog/catalog-products-list";
import TableLoading from "src/components/table-loading";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [cursor, setCursor] = useState({ lastCursor: "" });
  const [pageInfo, setPageInfo] = useState();
  const [productList, setProductList] = useState();
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
    mutate,
  } = GetProductsPaginate({
    productPerPage,
    catalogId,
    cursor: cursor,
  });
  
  useEffect(() => {
    if (product) {
      setPageInfo(product.newData.pageInfo);
      setProductList(product)
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
          {catalog && (
            <Box>
              <CatalogInfo session={session} catalog={catalog.data[0]} />
              <CatalogPriceRule session={session} catalog={catalog.data[0]} />
              {!productList && <TableLoading />}
              {(prodError || (productList && productList.newData.totalCount === 0)) && (
                <Collapse in={!editStatus}>
                <Card>
                  <CardContent>
                    <Stack
                      spacing={1}
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Typography variant="subtitle1" textAlign={"center"}>
                        No product found!
                      </Typography>
                      <Button variant="outlined" onClick={() => setEditStatus(true)}>
                        Select a product
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
                </Collapse>
              )}
              <Collapse in={!editStatus}>
                {productList && productList.newData.totalCount > 0 && (
                  <CatalogSelectedProducts
                    prodList={productList}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                    handlePageChange={handlePageChange}
                    page={page}
                    productPerPage={productPerPage}
                    productCount={productList.newData.totalCount}
                    setEditStatus={setEditStatus}
                    prodLoading={prodLoading}
                  />
                )}
              </Collapse>
              <Collapse in={editStatus}>
                <CatalogProductList
                  catalog={catalog.data[0]}
                  setEditStatus={setEditStatus}
                  productMutate={mutate}
                />
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
