import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetOrdersDataSwr } from "src/service/use-shopify";

import { Box, Container, Stack, Typography } from "@mui/material";
import OrdersTable from "src/sections/orders/orders-table";
import OrdersSearch from "src/sections/orders/orders-search";
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
  const [search, setSearch] = useState();
  const [filter, setFilter] = useState({});
  const { data: session } = useSession();
  const router = useRouter();
  const orderFilter = router.query?.filter;

  const orderSession = (session) => {
    switch (session?.user.detail.role) {
      case "admin":
        return {
          session: "admin",
        };
      case "sales":
        return {
          session: "sales",
          salesId: session?.user.id,
        };
      default:
        return {
          session: "customer",
          email: session?.user.detail.email,
        };
    }
  };

  const { data, isLoading, isError } = GetOrdersDataSwr({
    fetchData,
    session: orderSession(session),
    search: search,
    filter: filter,
  });

  const handlePageChange = useCallback(
    async (value) => {
      setFetchData({
        direction: value,
        startCursor: data.newData.pageInfo.startCursor,
        endCursor: data.newData.pageInfo.endCursor,
      });

      if (value === "next") {
        setPageNumber(pageNumber + 1);
      } else {
        setPageNumber(pageNumber - 1);
      }
    },
    [data, pageNumber]
  );

  useEffect(() => {
    if (!data) return;
    setHasPrev(data.newData.pageInfo.hasPreviousPage);
    setHasNext(data.newData.pageInfo.hasNextPage);
  }, [data]);

  useEffect(() => {
    if (orderFilter) {
      switch (orderFilter) {
        case "financial-pending":
          setFilter({ financialStatus: "PENDING" });
          break;
        case "paid-unfulfilled":
          setFilter({ financialStatus: "PAID", fulfillmentStatus: "UNFULFILLED", status: "OPEN" });
          break;
        case "overdue":
          setFilter({ paymentStatus: "Overdue" });
          break;
        default:
          setFilter({});
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderFilter]);

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
            <Box sx={{ mb: 2 }}>
              <OrdersSearch setSearch={setSearch} setFilter={setFilter} filter={filter} />
            </Box>
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
