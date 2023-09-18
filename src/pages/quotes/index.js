import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { QuotesTable } from 'src/sections/quotes/quotes-table';
import { QuotesTab } from 'src/sections/quotes/quotes-tab';
import { QuotesSearch } from 'src/sections/quotes/quotes-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { ClientRequest } from 'src/lib/ClientRequest'
import { getQuotesData } from 'src/service/use-mongo'

const Page = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [quotesData, setQuotesData] = useState([]);
  const [count, setCount] = useState(0)

  const reqQuotesData = async(page, rowsPerPage) => {
    const resQuotes = await getQuotesData(page, rowsPerPage, { status: { $nin: [ "new" ] } }) 
    if (!resQuotes) {
      console.log("error get quotes data!")
      return
    }
    setQuotesData(resQuotes.data.quote)
    setCount(resQuotes.data.count)
  }

  useEffect(() => {
    reqQuotesData(page, rowsPerPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = useCallback(
    async (event, value) => {
      setPage(value);
      reqQuotesData(value, rowsPerPage)
    },
    [rowsPerPage]
  );

  const handleRowsPerPageChange = useCallback(
    async (event) => {
      setPage(0);
      setRowsPerPage(event.target.value);
      reqQuotesData(0, event.target.value);
    },
    []
  );

  return (
    <>
      <Head>
        <title>
          Quotes | skratch
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Quotes
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Link
                  href="/quotes/add-quote"
                  passHref
                >
                  <Button
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    )}
                    variant="contained"
                  >
                    Add
                  </Button>
                </Link>
              </div>
            </Stack>
            <QuotesSearch />
            <QuotesTable
              count={count}
              items={quotesData}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
