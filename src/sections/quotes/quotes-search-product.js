/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import Image from 'next/image'
import { ClientRequest } from 'src/lib/ClientRequest'
import OptionsComponent from 'src/components/products/options'
import {
  Box,
  Button,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const SearchProduct = ({quotesList, setQuotesList}) => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [productSearch, setProductSearch] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const getOptions = async (active, value) => {

    if (active) {
      const data = await ClientRequest(
        "/api/shopify/get-product",
        "POST",
        { search: inputValue }
      )

      let newOptions = [];

      if (value) {
        newOptions = [value];
      }
      
      if (data) {
        const dataProd = data.newData.data.products.edges
        if (dataProd.length > 0) {
          newOptions = [...newOptions, ...data.newData.data.products.edges];
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
    setSelectedQuantity(1)
  };

  const handleAddQuote = useCallback (
    () => {
      const oldQuote = [...quotesList]
      const newQuote = {
        variant: selectedVariant,
        qty: selectedQuantity
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
    if(!value) return undefined;

    const selectedVar = value.node.variants.edges[0].node;
    const selectedOpt = selectedVar.selectedOptions.reduce((acc, curr) => (acc[curr.name] = curr.value, acc), {});
    setSelectedVariant(selectedVar)
    setSelectedOptions(selectedOpt)
  }, [value]);

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        xs={12}
        md={6}
      >
        <Typography
          variant="body2"
        >
          Product search
        </Typography>
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
              fullwidth={true}
            />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props}>
                <Grid
                  container
                  alignItems="left"
                >
                  <Grid
                    item
                    sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}
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
        <OptionsComponent
          options={value?.node.options}
          handleChange={handleChange}
          selectedOpt={selectedOptions}
        />
      </Grid>
      <Grid
        xs={12}
        md={6}
      >
        {selectedVariant &&
          <Box>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
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
                md={6}
              >
                <Typography
                  variant="body2"
                >
                  Price: ${selectedVariant.price.amount}
                </Typography>
                <Typography
                  variant="body2"
                >
                  Stock: {selectedVariant.currentlyNotInStock ? "In stock" : "Out of stock"}
                </Typography>
                <Typography
                  variant="body2"
                >
                  Sku: {selectedVariant.sku}
                </Typography>
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
                  onChange={(event) => {
                    setSelectedQuantity(event.target.value);
                  }}
                />
                <Button 
                  variant="contained"
                  onClick={handleAddQuote}
                >
                  Add to Quote List
                </Button>
              </Grid>
            </Grid>

          </Box>
        }
      </Grid>
    </Grid>
  );
}