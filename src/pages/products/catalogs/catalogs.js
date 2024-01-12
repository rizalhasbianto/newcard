import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Collapse } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { QuotesTable } from "src/sections/quotes/quotes-table";
import { QuotesSearch } from "src/sections/quotes/quotes-search";
import { applyPagination } from "src/utils/apply-pagination";
import { GetQuotesDataSwr } from "src/service/use-mongo";
import TableLoading from "src/components/table-loading";
import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";
import CatalogType from "src/sections/catalog/catalog-type";

const Quotes = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addCatalog, setAddCatalog] = useState(false);
  const toastUp = useToast();
  const { data: session } = useSession();;

  const quoteQuery = (session) => {
    switch (session?.user.detail.role) {
      case "admin":
        return {
          status: { $nin: ["new", "draft"] },
        };
      case "sales":
        return {
          status: { $nin: ["new", "draft"] },
          "company.sales.id": session?.user.detail.id,
        };
      default:
        return {
          status: { $nin: ["new", "draft"] },
          "company.name": session?.user.detail.company.companyName,
        };
    }
  };

  const { data, isLoading, isError, mutate, isValidating } = GetQuotesDataSwr(
    page,
    rowsPerPage,
    quoteQuery(session)
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
                <Typography variant="h4">Catalog</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    !addCatalog ? (
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    ) : (
                      <SvgIcon fontSize="small">
                        <HighlightOffIcon />
                      </SvgIcon>
                    )
                  }
                  variant="contained"
                  onClick={() => setAddCatalog(!addCatalog)}
                >
                  {!addCatalog ? "Add" : "Cancel"}
                </Button>
              </div>
            </Stack>
            <Collapse in={addCatalog}>
              <CatalogType toastUp={toastUp} />
            </Collapse>
            <Collapse in={!addCatalog}>
              {isLoading && <TableLoading />}
              {(isError || (data && data.data.quote.length === 0)) && (
                <Stack
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Typography variant="subtitle1">Create new catalog</Typography>
                  <LoadingButton
                    color="primary"
                    onClick={() => setAddCatalog(!addCatalog)}
                    loading={false}
                    loadingPosition="start"
                    startIcon={<AddIcon />}
                    variant="outlined"
                  >
                    Add
                  </LoadingButton>
                </Stack>
              )}
            </Collapse>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Quotes;
