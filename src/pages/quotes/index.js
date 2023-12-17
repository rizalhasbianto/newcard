import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const toastUp = useToast();
  const { data: dataUser } = useSession();

  const quoteQuery =
    dataUser?.user?.detail?.role !== "admin"
      ? {
          status: { $nin: ["new", "draft"] },
          "company.name": dataUser?.user?.detail?.company.companyName,
        }
      : {
          status: { $nin: ["new", "draft"] },
        };

  const { data, isLoading, isError, mutate, isValidating } = GetQuotesDataSwr(
    page,
    rowsPerPage,
    quoteQuery
  );

  useEffect(() => {
    if (isValidating) {
      toastUp.handleStatus("loading");
      toastUp.handleMessage("Validating data");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidating]);

  const handlePageChange = useCallback(async (event, value) => {
    setPage(value);
  }, []);

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
          <Toast
            toastStatus={toastUp.toastStatus}
            handleStatus={toastUp.handleStatus}
            toastMessage={toastUp.toastMessage}
          />
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
                mutateData={mutate}
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
