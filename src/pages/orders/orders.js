import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OrdersTable } from "src/sections/orders/orders-table";
import { QuotesSearch } from "src/sections/quotes/quotes-search";
import { GetOrdersDataSwr } from "src/service/use-shopify";
import TableLoading from "src/components/table-loading";

const Orders = () => {
  const [fetchData, setFetchData] = useState({
    direction: "",
    startCursor: "",
    endCursor: "",
  });
  const [pageNumber, setPageNumber] = useState(0);

  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const { data, isLoading, isError } = GetOrdersDataSwr(fetchData);

  const handlePageChange = useCallback(
    async (value) => {
      setFetchData({
        direction: value,
        startCursor: data.newData.pageInfo.startCursor,
        endCursor: data.newData.pageInfo.endCursor,
      });

      if(value === "next") {
        setPageNumber(pageNumber+1)
      } else {
        setPageNumber(pageNumber-1)
      }
    },
    [data,pageNumber]
  );

  useEffect(() => {
    if (!data) return;
    setHasPrev(data.newData.pageInfo.hasPreviousPage);
    setHasNext(data.newData.pageInfo.hasNextPage);
  }, [data]);

  return (
    <>
      <Head>
        <title>Orders | skratch</title>
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
                <Typography variant="h4">Orders</Typography>
              </Stack>
            </Stack>
            {
              //<QuotesSearch />
            }
            {isLoading && <TableLoading />}
            {isError && <h2>Error loading data</h2>}
            {data && (
              <OrdersTable
                items={data.newData.edges}
                handlePageChange={handlePageChange}
                hasPrev={hasPrev}
                hasNext={hasNext}
                pageNumber={pageNumber}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Orders;
