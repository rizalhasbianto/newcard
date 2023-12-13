import Head from "next/head";
import Link from "next/link";
import { useCallback, useMemo, useState, useEffect } from "react";
import { GetTicketsDataSwr } from "src/service/use-mongo";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";
import TableLoading from "src/components/table-loading";
import { TicketsTable } from "src/sections/tickets/tickets-table";

const Tickets = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const toastUp = useToast();

  const { data, isLoading, isError, mutate, isValidating } = GetTicketsDataSwr(page, rowsPerPage, {
    status: { $nin: ["new"] },
  });

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
        <title>Tickets | Devias Kit</title>
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
              <Typography variant="h4">Tickets</Typography>
              <div>
                <Link href="/tickets/add-ticket" passHref>
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
            {isLoading && <TableLoading />}
            {isError && <h2>Error loading data</h2>}
            {data && (
              <TicketsTable
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

export default Tickets;
