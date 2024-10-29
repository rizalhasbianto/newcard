import Head from "next/head";
import { GetQuoteCollections, DeleteQuoteCollections } from "src/service/use-mongo";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import QuotesCollection from "src/sections/quotes/collections/QuotesCollection";
import TableLoading from "src/components/table-loading";

const Page = () => {
  const { data, isLoading, isError, mutate, isValidating } = GetQuoteCollections();

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
                <Typography variant="h4">Quote Collections</Typography>
              </Stack>
            </Stack>
            {isLoading && <TableLoading />}
            {isError && <h2>Error loading data</h2>}
            {data && data.data.collections.length > 0 && (
              <QuotesCollection
                collections={data.data.collections}
                DeleteQuoteCollections={DeleteQuoteCollections}
                isValidating={isValidating}
                mutate={mutate}
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
