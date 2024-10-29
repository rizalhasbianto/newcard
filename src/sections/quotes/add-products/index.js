/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Link from "next/link";
import Image from "next/image";
import { ImageComponent } from "src/components/image";
import {
  Box,
  Button,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
  Collapse,
} from "@mui/material";
import { GetProductsShopify, GetProductsInfinite } from "src/service/use-shopify";
import { SearchProduct } from "./quotes-search-product";
import { QuickAddProducts } from "./quotes-quick-add";
import { QuoteCollections } from "./quote-collections";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export const SelectProducts = ({
  quotesList,
  setQuotesList,
  quoteId,
  selectedCompany,
  session,
  handleSubmit
}) => {
  const [searchResultStatus, setSearchResultStatus] = useState("Start type for search!");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [productSearch, setProductSearch] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [runFetch, setRunFetch] = useState(false);
  const productPerPage = 10;
  const catalogCompany = selectedCompany ? [{ id: selectedCompany.shopifyCompanyLocationId }] : [];
  const {
    data: products,
    isLoading,
    isError,
    size,
    setSize,
  } = GetProductsInfinite({
    selectedFilter: {
      productName: inputValue,
    },
    catalogId: selectedCompany?.catalogIDs,
    catalogCompany,
    productPerPage,
    runFetch,
  });

  useEffect(() => {
    if (inputValue === "") {
      setSearchResultStatus("Start type for search!");
    } else {
      setSearchResultStatus("No products found!");
    }
    if (inputValue === "" || !products) {
      setProductSearch(selectedProduct ? [selectedProduct] : []);
      return undefined;
    }
    setProductSearch(products[0].newData.edges ?? []);
  }, [products]);

  return (
    <Box>
      <Grid container>
        <Grid md={6}>
          <Autocomplete
            id="skratch-search"
            sx={{ width: "100%", mb: "20px", mt: "5px" }}
            getOptionLabel={(option) =>
              typeof option.node.title === "string" ? option.node.title : option.node.title
            }
            filterOptions={(x) => x}
            options={productSearch}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={selectedProduct}
            noOptionsText={searchResultStatus}
            onChange={(event, newValue) => {
              setProductSearch(newValue ? [newValue, ...productSearch] : productSearch);
              setSelectedProduct(newValue);
              setActiveTab("search");
            }}
            onInputChange={(event, newInputValue) => {
              if (newInputValue.length > 2) {
                setRunFetch(true);
                setInputValue(newInputValue);
              }
            }}
            renderInput={(params) => <TextField {...params} label="Type product name" />}
            renderOption={(props, option) => {
              return (
                <li {...props}>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      width: "100%",
                      height: "50px",
                      marginBottom: "5px",
                    }}
                  >
                    <Grid
                      md={2}
                      sx={{
                        position: "relative",
                      }}
                    >
                      <ImageComponent
                        img={option.node.variants.edges[0].node?.image?.url}
                        title={option.node.title}
                      />
                    </Grid>
                    <Grid md={10}>
                      <Typography variant="body2" color="text.secondary">
                        {option.node.title}
                      </Typography>
                    </Grid>
                  </Grid>
                </li>
              );
            }}
          />
        </Grid>
        <Grid md={2}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              height: "54px",
              position: "relative",
              top: "5px",
            }}
            onClick={() => (activeTab === "quick" ? setActiveTab() : setActiveTab("quick"))}
          >
            Bulk Add
            {activeTab === "quick" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Button>
        </Grid>
        <Grid md={2}>
          <Link href={`/dashboard/products?quoteId=${quoteId}`} passHref>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                height: "54px",
                position: "relative",
                top: "5px",
              }}
            >
              Browse
            </Button>
          </Link>
        </Grid>
        <Grid md={2}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              height: "54px",
              position: "relative",
              top: "5px",
            }}
            onClick={() => setActiveTab("collection")}
          >
            Collection
          </Button>
        </Grid>
      </Grid>
      <Collapse in={selectedProduct && activeTab === "search" ? true : false}>
        {selectedProduct && (
          <SearchProduct
            quotesList={quotesList}
            setQuotesList={setQuotesList}
            selectedProduct={selectedProduct}
            handleSubmit={handleSubmit}
            selectedCompany={selectedCompany}
          />
        )}
      </Collapse>
      <Collapse in={activeTab === "quick" ? true : false}>
        {activeTab === "quick" && (
          <QuickAddProducts
            quotesList={quotesList}
            setQuotesList={setQuotesList}
            selectedCompany={selectedCompany}
            session={session}
            handleSubmit={handleSubmit}
          />
        )}
      </Collapse>
      <Collapse in={activeTab === "collection" ? true : false}>
        <QuoteCollections quotesList={quotesList} setQuotesList={setQuotesList} />
      </Collapse>
    </Box>
  );
};
