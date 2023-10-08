import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { QuotesTable } from "src/sections/quotes/quotes-table";
import { QuotesSearch } from "src/sections/quotes/quotes-search";
import { applyPagination } from "src/utils/apply-pagination";
import { GetQuotesDataSwr } from "src/service/use-mongo";
import TableLoading from "src/components/table-loading";

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, isError } = GetQuotesDataSwr(page, rowsPerPage, {
    status: { $nin: ["new"] },
  });

  const handlePageChange = useCallback(
    async (event, value) => {
      setPage(value);
    },[]
  );

  const handleRowsPerPageChange = useCallback(async (event) => {
    setPage(0);
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Quotes | skratch</title>
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
                <Typography variant="h4">Quotes</Typography>
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
                <Link href="/quotes/add-quote" passHref>
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
                </Link>
              </div>
            </Stack>
            <QuotesSearch />
            {isLoading && <TableLoading />}
            {isError && <h2>Error loading data</h2>}
            {data && (
              <QuotesTable
                count={data.data.count}
                items={data.data.quote}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
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