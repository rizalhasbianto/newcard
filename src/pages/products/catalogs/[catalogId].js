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
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CatalogInfo from "src/sections/catalog/catalog-info";
import CatalogPriceRule from "src/sections/catalog/catalog-price-rule";
import CatalogSelectedProduct from "src/sections/catalog/catalog-selected-products";
import CatalogProductList from "src/sections/catalog/catalog-products-list";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [productPerPage, setProductPerPage] = useState(10);
  const { data: session } = useSession();
  const catalogId = router.query?.catalogId;

  const handlePageChange = useCallback(async (event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback(async (event) => {
    setPage(0);
    setProductPerPage(event.target.value);
  }, []);

  const {
    data: catalog,
    isLoading,
    isError,
    mutate,
  } = GetCatalogSwr({
    page: 0,
    postPerPage: 1,
    query: { id: catalogId },
  });

  const {
    data: product,
    isLoading: prodLoading,
    isError: prodError,
  } = GetProductsPaginate({
    productPerPage,
    catalogId,
  });

  console.log("product", product);
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
          <Box>
            {catalog && (
              <>
                <CatalogInfo session={session} catalog={catalog.data[0]} />
                <CatalogPriceRule session={session} catalog={catalog.data[0]} />
                {product && (
                  <CatalogSelectedProduct
                    prodList={product}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                    handlePageChange={handlePageChange}
                  />
                )}

                <CatalogProductList
                  catalog={catalog.data[0]}
                />
              </>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
