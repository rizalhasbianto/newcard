import Head from "next/head";
import { GetQuoteCollections } from 'src/service/use-mongo'
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import QuotesCollection from "src/sections/quotes/collections/QuotesCollection";
import TableLoading from "src/components/table-loading";


const Page = () => {

  const { data, isLoading, isError } = GetQuoteCollections();
console.log("data", data)
  return (
    <>
      <Head>
        <title>Quote Collections | skratch</title>
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
            {isLoading && <TableLoading />}
            {isError && <h2>Error loading data</h2>}
            {data && (
              <QuotesCollection collections={data.data.collections}/>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
