/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { ClientRequest } from 'src/lib/ClientRequest'
import OptionsComponent from 'src/components/products/options'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  ListItemText,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const SearchProduct = () => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  const getOptions = async (active, value) => {
    const data = await ClientRequest(
      "/api/shopify/get-product",
      "POST",
      { search: inputValue }
    )
    if (active) {
      let newOptions = [];

      if (value) {
        newOptions = [value];
      }

      if (data) {
        newOptions = [...newOptions, ...data.newData.data.products.edges];
      }

      setOptions(newOptions);
    }
    return data
  }

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
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
          options={options}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={value}
          noOptionsText="No product found!"
          onChange={(event, newValue) => {
            setOptions(newValue ? [newValue, ...options] : options);
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
      </Grid>
      <Grid
        xs={12}
        md={6}
      >
        <OptionsComponent options={value?.node.options} />
      </Grid>
    </Grid>
  );
}