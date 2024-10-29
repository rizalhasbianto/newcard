import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetQuotesDataSwr } from "src/service/use-mongo";

import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import QuotesTable from "src/sections/quotes/quotes-table";
import QuotesSearch from "src/sections/quotes/quotes-search";
import TableLoading from "src/components/table-loading";
import Toast from "src/components/toast";
import { useToast } from "src/hooks/use-toast";

const Quotes = () => {
  const querySession = useCallback((session) => {

    switch (session?.user.detail.role) {
      case "admin":
        return {};
      case "sales":
        return {
          "company.sales.id": session?.user.detail.id,
        };
      default:
        return {
          "company.name": session?.user.detail.company.companyName,
        };
    }
  },[]);
  
  const router = useRouter();
  const quoteStatus = router.query?.status;
  const toastUp = useToast();
  const { data: session } = useSession();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState();
  
  const [query, setQuery] = useState();

  const { data, isLoading, isError, mutate, isValidating } = GetQuotesDataSwr({
    page,
    rowsPerPage,
    quoteQuery: query,
    search,
    runFetch: query ? true : false,
  });

  useEffect(() => {
    if (isValidating) {
      toastUp.handleStatus("loading");
      toastUp.handleMessage("Validating data");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidating]);

  useEffect(() => {
    if(session || quoteStatus) {
      const queryData = querySession(session)
      if(quoteStatus) {
        setQuery({...queryData, status: quoteStatus});
      } else {
        setQuery(queryData)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, quoteStatus]);

  const handlePageChange = useCallback(async (event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback(async (event) => {
    setPage(0);
    setRowsPerPage(event.target.value);
  }, []);

  const handleQuoteQuery = useCallback(async (event, value) => {
    const queryData = querySession(session)
    if(event.target.value) {
      setQuery({...queryData, status: event.target.value});
    } else {
      setQuery({...queryData});
    }
  }, [querySession, session]);



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
              </Stack>
              <div>
                <Link href="/dashboard/quotes/add-quote" passHref>
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
            {<QuotesSearch setSearch={setSearch} handleQuoteQuery={handleQuoteQuery} query={query}/>}
            {isLoading && <TableLoading />}
            {(isError || (data && data.data.quote.length === 0)) && (
              <Typography variant="h5" textAlign={"center"}>
                No data found!
              </Typography>
            )}
            {data && data.data.quote.length > 0 && (
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

export default Quotes;
