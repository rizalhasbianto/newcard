/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
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

export const SearchProduct = () => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [productSearch, setProductSearch] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("");

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
      console.log("data", data)
      if (data) {
        const dataProd = data.newData.data.products.edges
        if(dataProd.length > 0) {
          newOptions = [...newOptions, ...data.newData.data.products.edges];
          const selectedVar = dataProd[0].node.variants.edges[0].node;
          const selectedOpt = selectedVar.selectedOptions.reduce((acc,curr)=> (acc[curr.name]=curr.value,acc),{});
          setSelectedVariant(selectedVar)
          setSelectedOptions(selectedOpt)
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

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setProductSearch(value ? [value] : []);
      setSelectedVariant(value ? [value] : "")
      setSelectedOptions(value ? [value] : "")
      return undefined;
    }

    getOptions(active, value);
    console.log("value", value)
    return () => {
      active = false;
    };
  }, [value, inputValue]);

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
          sx={{ width: '100%' }}
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
                <Button variant="contained">Add to Quote List</Button>
              </Grid>
            </Grid>

          </Box>
        }
      </Grid>
      <Grid
        xs={12}
        md={6}
      >
        <OptionsComponent
          options={value?.node.options}
          handleChange={handleChange}
          selectedOpt={selectedOptions}
        />
      </Grid>
    </Grid>
  );
}