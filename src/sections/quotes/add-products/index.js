/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Link from "next/link";
import Image from "next/image";
import { ImageComponent } from "src/components/image"
import { Box, Button, TextField, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { GetProductsShopify } from "src/service/use-shopify";
import { SearchProduct } from "./quotes-search-product";
import { QuickAddProducts } from "./quotes-quick-add"
import { QuoteCollections } from "./quote-collections"

export const SelectProducts = ({ quotesList, setQuotesList, quoteId }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [productSearch, setProductSearch] = useState([]); 
  const [activeTab, setActiveTab] = useState("search");

  const getOptions = async (active, selectedProduct) => {
    if (active) {
      const resData = await GetProductsShopify({productName:`${inputValue}*`});

      let newOptions = [];

      if (selectedProduct) {
        newOptions = [selectedProduct];
      }

      if (resData) { 
        const dataProd = resData.newData.edges;
        if (dataProd.length > 0) {
          newOptions = [...newOptions, ...dataProd];
        }
      }

      setProductSearch(newOptions);
    }
  };

  useEffect(() => {
    let active = true;
    if (inputValue === "") {
      setProductSearch(selectedProduct ? [selectedProduct] : []);
      return undefined;
    }

    getOptions(active, selectedProduct);

    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Box>
      <Grid container>
        <Grid md={6}>
          <Autocomplete
            id="google-map-demo"
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
            noOptionsText="No product found!"
            onChange={(event, newValue) => {
              setProductSearch(newValue ? [newValue, ...productSearch] : productSearch);
              setSelectedProduct(newValue);
              setActiveTab("search");
            }}
            onInputChange={(event, newInputValue) => {
              if(newInputValue.length > 2) {
                setInputValue(newInputValue);
              }
            }}
            renderInput={(params) => <TextField {...params} label="Type for start search" />}
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
                      <ImageComponent img={option.node.variants.edges[0].node?.image?.url} title={option.node.title} />
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
            onClick={() => setActiveTab("quick")}
          >
            Quick Add
          </Button>
        </Grid>
        <Grid md={2}>
          <Link href={`/products?quoteId=${quoteId}`} passHref>
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
      {selectedProduct && activeTab === "search" && (
        <SearchProduct
          quotesList={quotesList}
          setQuotesList={setQuotesList}
          selectedProduct={selectedProduct}
        />
      )}
      {activeTab === "quick" && (
        <QuickAddProducts
          quotesList={quotesList}
          setQuotesList={setQuotesList}
        />
      )}
      {activeTab === "collection" && (
        <QuoteCollections
          quotesList={quotesList}
          setQuotesList={setQuotesList}
        />
      )}
    </Box>
  );
};
