import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Grid,
} from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import LoadingButton from "@mui/lab/LoadingButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DvrIcon from "@mui/icons-material/Dvr";

import ProductsSearch from "src/sections/products/products-search";
import ProductGrid from "src/sections/products/product-grid";
import ProductTable from "src/sections/products/product-table";
import ProductAlertDialogQuoteList from "src/sections/products/product-alert-dialog-quotelist";
import ProductAlertDialogCompanyList from "src/sections/products/product-alert-dialog-companylist";

import Toast from "src/components/toast";
import { useToast } from "src/hooks/use-toast";

import { GetProductsInfinite } from "src/service/use-shopify";
import { GetQuotesData, GetCompanyCatalog } from "src/service/use-mongo";
import CardLoading from "src/components/grid-loading";

const Products = () => {
  const [layout, setLayout] = useState("card");
  const [hasNextPage, sethasNextPage] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState({
    productName: "",
    collection: "",
    productType: "",
    productVendor: "",
    tag: "",
  });
  const [selectedVariantFilter, setSelectedVariantFilter] = useState([]);
  const [smartSearch, setSmartSearch] = useState();
  const [openQuote, setOpenQuote] = useState(false);
  const [catalogID, setCatalogID] = useState([]);
  const [catalogCompany, setCatalogCompany] = useState([]);
  const [openCompany, setOpenCompany] = useState(false);
  const [runFetch, setRunFetch] = useState(false);
  const toastUp = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const quoteId = router.query?.quoteId;
  const quoteCompanyName = router.query?.companyName;

  const productPerPage = 12;
  const { data, isLoading, isError, size, setSize } = GetProductsInfinite({
    selectedFilter,
    selectedVariantFilter,
    smartSearch,
    catalogId: catalogID,
    catalogCompany,
    productPerPage,
    runFetch,
  });

  const handleLoadMore = () => {
    setSize(size + 1);
  };

  const handleOpenQuoteList = useCallback(() => {
    setOpenQuote(true);
  }, []);

  const catalogCustomer = useCallback(async (id) => {
    const companyCatalogID = await GetCompanyCatalog({ id });
    if(companyCatalogID.newData && companyCatalogID.newData.length > 0) {
      setCatalogCompany([{ id: companyCatalogID.newData[0].shopifyCompanyLocationId }]);
      setCatalogID(companyCatalogID.newData[0].catalogIDs);
    }
    setRunFetch(true);
  }, []);

  const productByQuote = useCallback(async (quoteCompanyName) => {
    const companyCatalogID = await GetCompanyCatalog({ query: { name: quoteCompanyName } });
    setCatalogCompany([
      { id: companyCatalogID.newData[0].shopifyCompanyLocationId, name: quoteCompanyName },
    ]);
    setCatalogID(companyCatalogID.newData[0].catalogIDs);
    setRunFetch(true);
  }, []);

  useEffect(() => {
    if (!data) return;
    sethasNextPage(data.at(-1).newData?.pageInfo?.hasNextPage);
  }, [data]);

  useEffect(() => {
    if (session && session?.user.detail.role === "customer") {
      catalogCustomer(session?.user.detail.company.companyId);
    } else {
      if (quoteCompanyName) {
        productByQuote(quoteCompanyName);
      } else {
        setRunFetch(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, quoteCompanyName]);

  return (
    <>
      <Head>
        <title>Products | Skratch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <ProductAlertDialogQuoteList
            openQuote={openQuote}
            setOpenQuote={setOpenQuote}
            session={session}
          />
          <ProductAlertDialogCompanyList
            openCompany={openCompany}
            setOpenCompany={setOpenCompany}
            session={session}
            catalogCompany={catalogCompany}
            setCatalogCompany={setCatalogCompany}
          />
          <Toast
            toastStatus={toastUp.toastStatus}
            handleStatus={toastUp.handleStatus}
            toastMessage={toastUp.toastMessage}
          />
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Products</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button onClick={() => setLayout("list")}>
                      <SvgIcon fontSize="small">
                        <DvrIcon
                          sx={{ color: layout === "list" ? "neutral.800" : "neutral.400" }}
                        />
                      </SvgIcon>
                    </Button>
                    <Button onClick={() => setLayout("card")}>
                      <SvgIcon fontSize="small">
                        <DashboardIcon
                          sx={{ color: layout === "card" ? "neutral.800" : "neutral.400" }}
                        />
                      </SvgIcon>
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Stack>
              <Box>
                {session?.user.detail.role !== "customer" && (
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                    onClick={() => setOpenCompany(true)}
                    size="medium"
                  >
                    Check Company Price
                  </Button>
                )}
                {!quoteId ? (
                  <>
                    <Button
                      startIcon={
                        <SvgIcon fontSize="small">
                          <PlusIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                      onClick={handleOpenQuoteList}
                      sx={{ ml: 1 }}
                    >
                      Choose Quote
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" onClick={handleOpenQuoteList} sx={{ ml: 1 }}>
                      Selected Quote #{quoteId.slice(-4)}
                    </Button>
                    <Link href={`/quotes/add-quote?quoteID=${quoteId}`}>
                      <Button variant="contained" sx={{ ml: 1 }}>
                        Open Quote #{quoteId.slice(-4)}
                      </Button>
                    </Link>
                  </>
                )}
              </Box>
            </Stack>
            <ProductsSearch
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              selectedVariantFilter={selectedVariantFilter}
              setSelectedVariantFilter={setSelectedVariantFilter}
              filterList={data?.at(-1).newData.productFilters}
              smartSearch={smartSearch}
              setSmartSearch={setSmartSearch}
              predictiveSearch={data?.at(-1).newData.predictiveSearch}
              catalogID={catalogID}
              setCatalogID={setCatalogID}
              session={session}
              quoteCompanyName={quoteCompanyName}
            />
            {isLoading && <CardLoading count={4} />}
            {data && data[0]?.newData?.edges?.length === 0 && (
              <Typography variant="h4">No Products Found!</Typography>
            )}
            <Stack spacing={3}>
              <Grid container spacing={3}>
                {isError && <Typography variant="h5">No data found</Typography>}
                {layout === "card" ? (
                  <ProductGrid
                    handleOpenQuoteList={handleOpenQuoteList}
                    data={data}
                    catalogCompany={catalogCompany}
                    toastUp={toastUp}
                    quoteId={quoteId}
                    session={session}
                  />
                ) : (
                  <ProductTable
                    handleOpenQuoteList={handleOpenQuoteList}
                    data={data}
                    catalogCompany={catalogCompany}
                    toastUp={toastUp}
                    productPerPage={productPerPage}
                    quoteId={quoteId}
                    session={session}
                  />
                )}
              </Grid>
            </Stack>
            {hasNextPage ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <LoadingButton
                  color="primary"
                  onClick={() => handleLoadMore()}
                  loading={!data || data.length < size ? true : false}
                  loadingPosition="start"
                  startIcon={<AutorenewIcon />}
                  variant="contained"
                >
                  LOAD MORE
                </LoadingButton>
              </Box>
            ) : (
              ""
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Products;
