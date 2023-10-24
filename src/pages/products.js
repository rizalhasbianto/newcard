import Head from "next/head";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import LoadingButton from "@mui/lab/LoadingButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ProductCard } from "src/sections/products/product-card";
import { ProductsSearch } from "src/sections/products/products-search";

import { GetProductsShopifySwr } from "src/service/use-shopify";
import { useEffect, useState } from "react";

const Page = () => {
  const [query, setQuery] = useState({
    prodName: "",
    collection: "",
    prodType: "",
    prodVendor: "",
    prodTag: "",
  });

  const productPerPage = 9;
  const lastCursor = "";
  const lodMoreCount = 0;

  const { data, isLoading, isError } = GetProductsShopifySwr(
    query,
    productPerPage,
    lastCursor,
    lodMoreCount
  );

  const handleLoadMore = () => {
    console.log("load more");
  };

  useEffect(() => {
    console.log("Products", data);
  }, [data]);

  return (
    <>
      <Head>
        <title>Products | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Companies</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <ProductsSearch />
            <Grid container spacing={3}>
              {data &&
                data.newData.edges.map((product, i) => (
                  <Grid xs={12} md={6} lg={4} key={i + 1}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <LoadingButton
                color="primary"
                onClick={() => handleLoadMore()}
                loading={true}
                loadingPosition="start"
                startIcon={<AutorenewIcon />}
                variant="contained"
              >
                LOAD MORE
              </LoadingButton>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
