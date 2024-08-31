import Head from "next/head";
import { useCallback, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { subDays, subHours } from "date-fns";
import { Box, Container, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewLatestOrders } from "src/sections/overview/overview-latest-orders";
import { OverviewLatestProducts } from "src/sections/overview/overview-latest-products";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";

import { GetTotalQuotes, GetTotalSales, SyncSales } from "src/service/use-mongo";
import { GetOrdersCount, GetTodayOrders } from "src/service/use-shopify";

import { month } from "src/data/date-range";

const now = new Date();

function Page() {
  const [syncLoading, setSyncLoading] = useState(false);
  const openQuotesQuery = { status: "open" };
  const pendingPaymentQuery = { financial_status: "pending", status: "open" };
  const pendingPaidQuery = {
    financial_status: "paid",
    fulfillment_status: "Unfulfilled",
    status: "open",
  };
  const {
    data: openQuotes,
    isLoading,
    isError,
    mutate,
    isValidating,
  } = GetTotalQuotes({ query: openQuotesQuery });
  const { data: pendingPayment } = GetOrdersCount({ query: pendingPaymentQuery });
  const { data: pendingPaid } = GetOrdersCount({ query: pendingPaidQuery });
  const { data: sales, mutate: salesMutate, isLoading: salesLoading } = GetTotalSales();
  const { data: todayOrders } = GetTodayOrders();
  const { data: session } = useSession();
  console.log("session", session);

  const salesData = [];
  if (sales) {
    month.forEach((itm) => {
      const salesDataMonth = sales?.newData[0].sales.find((item) => item.month === itm.month);
      const salesTotal = Number((Number(salesDataMonth.sales) / 1000).toFixed(2));
      salesData.push(salesTotal);
    });
  }
  const handleSync = async () => {
    setSyncLoading(true);
    const syncNewData = await SyncSales();
    if (syncNewData) {
      salesMutate();
    }
    setSyncLoading(false);
  };

  return (
    <>
      <Head>
        <title>Overview | Skratch</title>
      </Head>
      {session && (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            {session.user.detail.role === "admin" && (
              <Grid container spacing={3}>
                <Grid xs={12} sm={6} lg={3}>
                  <OverviewBudget
                    sx={{ height: "100%" }}
                    value={openQuotes ? openQuotes.data.count : ""}
                    title="Open quotes"
                    icon="open"
                    color="primary.main"
                  />
                </Grid>
                <Grid xs={12} sm={6} lg={3}>
                  <OverviewBudget
                    sx={{ height: "100%" }}
                    value={pendingPayment ? pendingPayment.newData.orderCount : ""}
                    title="order payment pending"
                    icon="pending"
                    color="warning.main"
                  />
                </Grid>
                <Grid xs={12} sm={6} lg={3}>
                  <OverviewBudget
                    sx={{ height: "100%" }}
                    value={pendingPaid ? pendingPaid.newData.orderCount : ""}
                    title="order paid unfulfilled"
                    icon="paid"
                    color="info.main"
                  />
                </Grid>
                <Grid xs={12} sm={6} lg={3}>
                  <OverviewBudget
                    sx={{ height: "100%" }}
                    value="0"
                    title="order over due"
                    icon="over"
                    color="error.main"
                  />
                </Grid>
                <Grid xs={12} lg={8}>
                  {!salesLoading && salesData && (
                    <OverviewSales
                      chartSeries={[
                        {
                          name: "This year",
                          data: salesData,
                        },
                        {
                          name: "Last year",
                          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        },
                      ]}
                      sx={{ height: "100%" }}
                      handleSync={handleSync}
                      salesLoading={salesLoading}
                      syncLoading={syncLoading}
                    />
                  )}
                </Grid>
                <Grid xs={12} lg={4}>
                  {todayOrders && <OverviewLatestOrders todayOrders={todayOrders.data.orders} />}
                </Grid>
              </Grid>
            )}
            {session.user.detail.role === "customer" ||
              (session.user.detail.role === "sales" && (
                <Grid container spacing={3} color={"rgb(92, 89, 172)"}>
                  <Grid lg={12}>
                    <Typography variant="h2" sx={{textAlign:"center"}}>Welcome</Typography>
                    <Typography variant="h2" sx={{textAlign:"center"}}>to</Typography>
                    <Typography variant="h2" sx={{textAlign:"center"}}>Skratch B2B App</Typography>
                  </Grid>
                  <Grid lg={12} sx={{ position: "relative", height:"50vh" }}>
                    <Image src="/assets/b2b-bg-2.png" fill={true} objectFit="contain" alt="Picture of the author" />
                  </Grid>
                </Grid>
              ))}
          </Container>
        </Box>
      )}
    </>
  );
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
