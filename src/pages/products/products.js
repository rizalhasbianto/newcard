import Head from "next/head";
import { useRouter } from "next/router";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import LoadingButton from "@mui/lab/LoadingButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DvrIcon from "@mui/icons-material/Dvr";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";

import { ProductGrid } from "src/sections/products/product-grid";
import { ProductsSearch } from "src/sections/products/products-search";
import { ProductTable } from "src/sections/products/product-table";
import ProductAlertDialogQuoteList from "src/sections/products/product-alert-dialog-quotelist";

import Toast from "src/components/toast";
import { useToast } from "src/hooks/use-toast";

import { SearchProducts } from "src/service/use-shopify";
import { GetQuotesData } from "src/service/use-mongo";
import { useCallback, useEffect, useState } from "react";
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
  const [quoteList, setQuoteList] = useState(false);
  const toastUp = useToast();
  const router = useRouter();
  const quoteId = router.query?.quoteId;

  const productPerPage = 12;
  const lastCursor = "";
  const lodMoreCount = 0;
  const { data, isLoading, isError, size, setSize } = SearchProducts(
    selectedFilter,
    selectedVariantFilter,
    smartSearch,
    productPerPage,
    lastCursor,
    lodMoreCount
  );

  const handleLoadMore = () => {
    setSize(size + 1);
  };

  const handleOpenQuoteList = useCallback(async () => {
    const query = { $or: [{ status: "draft" }, { status: "new" }] };
    const sort = "DSC";
    const resQuotes = await GetQuotesData(0, 50, query, sort);
    if (!resQuotes) {
      console.log("resQuotes", resQuotes);
      return;
    }
    setQuoteList(resQuotes.data.quote);
    setOpenQuote(true);
  }, []);

  useEffect(() => {
    if (!data) return;
    console.log("data", data);
    sethasNextPage(data.at(-1).newData?.pageInfo?.hasNextPage);
  }, [data]);

  return (
    <>
      <Head>
        <title>Products | Devias Kit</title>
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
            quoteList={quoteList}
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
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={handleOpenQuoteList}
                >
                  Choose Quote
                </Button>
              </div>
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
            />
            {isLoading && <CardLoading count={4} />}
            {data && data[0]?.newData?.edges?.length === 0 && (
              <Typography variant="h4">No Products Found!</Typography>
            )}
            <Grid container spacing={3}>
              {isError && <Typography variant="h5">No data found</Typography>}
              {layout === "card" ? (
                <ProductGrid
                  handleOpenQuoteList={handleOpenQuoteList}
                  data={data}
                  toastUp={toastUp}
                  quoteId={quoteId}
                />
              ) : (
                <ProductTable
                  handleOpenQuoteList={handleOpenQuoteList}
                  data={data}
                  toastUp={toastUp}
                  productPerPage={productPerPage}
                  quoteId={quoteId}
                />
              )}
            </Grid>
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
