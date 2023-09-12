/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import Image from 'next/image'
import { ClientRequest } from 'src/lib/ClientRequest'
import OptionsComponent from 'src/components/products/options'
import AlertDialog from 'src/components/alert-dialog'
import { usePopover } from 'src/hooks/use-popover';
import {
  Box,
  Button,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const SearchProduct = ({ quotesList, setQuotesList }) => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [productSearch, setProductSearch] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const modalPopUp = usePopover();

  const getOptions = async (active, value) => {

    if (active) {
      const data = await ClientRequest(
        "/api/shopify/get-products",
        "POST",
        { search: inputValue }
      )

      let newOptions = [];

      if (value) {
        newOptions = [value];
      }

      if (data && data.newData.data) {
        const dataProd = data.newData.data.products.edges
        if (dataProd.length > 0) {
          newOptions = [...newOptions, ...dataProd];
        }
      }

      setProductSearch(newOptions);
    }
  }

  const handleChange = (event, newSingleOption) => {
    const getSelectedOption = newSingleOption.split(":")
    const newSelectedOptions = {
      ...selectedOptions,
      [getSelectedOption[0]]: getSelectedOption[1]
    }
    const variants = value.node.variants.edges
    const newSelecetdVariant = variants.find((variant) => {
      return variant.node.selectedOptions.every((selectedOption) => {
        return newSelectedOptions[selectedOption.name] === selectedOption.value;
      });
    });
    setSelectedOptions(newSelectedOptions);
    setSelectedVariant(newSelecetdVariant?.node)
  };

  const handleAddQuote = useCallback(
    () => {
      if (selectedVariant.currentlyNotInStock) {
        modalPopUp.handleContent(
          "Out Of Stock",
          "Unfortunately, the following item(s) that you ordered are now out-of-stock!"
        );
        modalPopUp.handleOpen();
        return
      }

      const findProdOnList = quotesList.findIndex((prod) => prod.variant.sku === selectedVariant.sku)
      if (findProdOnList >= 0) {
        const totalQty = parseInt(quotesList[findProdOnList].qty) + parseInt(selectedQuantity)
        quotesList[findProdOnList].qty = totalQty
        quotesList[findProdOnList].total = totalQty * quotesList[findProdOnList].variant.price.amount
        const oldQuote = [...quotesList]
        setQuotesList(oldQuote)
        return
      }

      const oldQuote = [...quotesList]
      const newQuote = {
        productName: value.node.title,
        variant: selectedVariant,
        qty: selectedQuantity,
        total: selectedQuantity * selectedVariant.price.amount
      }
      oldQuote.push(newQuote)
      setQuotesList(oldQuote)
    }
  )

  useEffect(() => {
    let active = true;
    if (inputValue === '') {
      setProductSearch(value ? [value] : []);
      setSelectedVariant(value ? [value] : "")
      setSelectedOptions(value ? [value] : "")
      return undefined;
    }

    getOptions(active, value);

    return () => {
      active = false;
    };
  }, [inputValue]);

  useEffect(() => {
    if (!value) return undefined;
    const selectedVar = value.node.variants.edges[0].node;
    console.log("selectedVar", selectedVar)
    const selectedOpt = selectedVar.selectedOptions.reduce((acc, curr) => (acc[curr.name] = curr.value, acc), {});
    console.log("selectedOpt", selectedOpt)
    setSelectedVariant(selectedVar)
    setSelectedOptions(selectedOpt)
  }, [value]);

  return (
    <>
      <AlertDialog
        title={modalPopUp.message.title}
        content={modalPopUp.message.content}
        open={modalPopUp.open}
        handleClose={modalPopUp.handleClose}
      />
      <Grid
        container
        spacing={3}
      >
        <Grid
          xs={12}
          md={5}
        >
          <Typography
            variant="body2"
          >
            Product search
          </Typography>
          <Grid container>
            <Grid md={10}>
              <Autocomplete
                id="google-map-demo"
                sx={{ width: '100%', mb: '20px', mt: '5px' }}
                getOptionLabel={(option) =>
                  typeof option.node.title === 'string' ? option.node.title : option.node.title
                }
                filterOptions={(x) => x}
                options={productSearch}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={value}
                noOptionsText="No product found!"
                onChange={(event, newValue) => {
                  setProductSearch(newValue ? [newValue, ...productSearch] : productSearch);
                  setValue(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type for start search"
                  />
                )}
                renderOption={(props, option) => {
                  return (
                    <li {...props}>
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          width: "100%",
                          height: "50px",
                          marginBottom: "5px"
                        }}
                      >
                        <Grid
                          md={2}
                          sx={{
                            position: "relative"
                          }}
                        >
                          <Image
                            src={option.node.variants.edges[0].node.image.url}
                            fill={true}
                            alt="Picture of the author"
                            className='shopify-fill'
                            sizes="270 640 750"
                          />
                        </Grid>
                        <Grid
                          md={10}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
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
              variant='outlined'
              sx={{
                height:"54px",
                position:"relative",
                top:"5px"
              }}
              >
                Browse
              </Button>
            </Grid>
          </Grid>
          <OptionsComponent
            options={value?.node.options}
            handleChange={handleChange}
            selectedOpt={selectedOptions}
          />
        </Grid>
        <Grid
          xs={12}
          md={7}
        >
          {selectedVariant &&
            <Box>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={5}
                  sx={{
                    position: "relative"
                  }}
                >

                  <Image
                    src={selectedVariant.image.url}
                    fill={true}
                    alt="Picture of the author"
                    className='shopify-fill'
                    sizes="270 640 750"
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={7}
                >
                  <Typography
                    variant="body2"
                  >
                    Price: ${selectedVariant.price.amount}
                  </Typography>
                  <Typography
                    variant="body2"
                  >
                    Stock: {selectedVariant.currentlyNotInStock ? "Out of stock" : "In stock"}
                  </Typography>
                  <Typography
                    variant="body2"
                  >
                    Sku: {selectedVariant.sku}
                  </Typography>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid
                      xs={12}
                      md={4}
                    >
                      <TextField
                        id="qtySingle"
                        label="Quantity"
                        variant="outlined"
                        InputProps={{ inputProps: { min: 1 } }}
                        type="number"
                        sx={{
                          mt: '10px',
                          mb: '10px'
                        }}
                        value={selectedQuantity}
                        onChange={(event) => {
                          setSelectedQuantity(event.target.value);
                        }}
                      />
                    </Grid>
                    <Grid
                      xs={12}
                      md={8}
                    >
                      <Button
                        variant="contained"
                        onClick={handleAddQuote}
                      >
                        Add to Quote List
                      </Button>
                    </Grid>
                  </Grid>


                </Grid>
              </Grid>

            </Box>
          }
        </Grid>
      </Grid>
    </>
  );
}