import Head from "next/head";
import { useState, useCallback, useEffect } from "react";
import { GetInventorySwr } from "src/service/use-shopify";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Box, Container, Typography, Stack } from "@mui/material";
import TableLoading from "src/components/table-loading";
import InventoryTable from "src/sections/products/inventory-table";
import ProductsSearch from "src/sections/products/products-search";

const Page = () => {
  const [selectedFilter, setSelectedFilter] = useState({
    productName: "",
    catalog: "",
    productType: "",
    productVendor: "",
    tag: "",
  });
  const [selectedVariantFilter, setSelectedVariantFilter] = useState([]);
  const [cursor, setCursor] = useState({ lastCursor: "" });
  const [page, setPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const productPerPage = 10;

  const { data, isLoading, isError } = GetInventorySwr({
    selectedFilter,
    selectedVariantFilter,
    productPerPage,
    cursor: cursor,
  });
  console.log("data", data);
  const handlePageChange = useCallback(
    async (event, value) => {
      if (value > page) {
        // go to next page
        setCursor({ lastCursor: data.newData.pageInfo.endCursor });
      } else {
        // go to prev page
        setCursor({ firstCursor: data.newData.pageInfo.startCursor });
      }
      setPage(value);
    },
    [page, data]
  );

  useEffect(() => {
    if (data) {
      setTotalProducts(data?.newData.totalCount);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Add New Ticket | skratch</title>
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
                <Typography variant="h4">Inventory</Typography>
              </Stack>
            </Stack>
            <ProductsSearch
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              selectedVariantFilter={selectedVariantFilter}
              setSelectedVariantFilter={setSelectedVariantFilter}
              filterList={data?.newData?.productFilters}
              stiky={false}
            />
            {isLoading && <TableLoading />}
            {isError && <h2>Error loading data</h2>}
            {data && (
              <InventoryTable
                products={data.newData}
                handlePageChange={handlePageChange}
                setCursor={setCursor}
                totalProducts={totalProducts}
                page={page}
                productPerPage={productPerPage}
                isLoading={isLoading}
                isError={isError}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
