import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { ClientRequest } from 'src/lib/ClientRequest'

export const SearchProduct = () => {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  const getOptions = async (active, value) => {
    const data = await ClientRequest(
      "/api/shopify/get-product",
      "POST",
      {search:inputValue}
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
  React.useEffect( () => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    getOptions(active, value);

    return () => {
      active = false;
    };
  }, [value, inputValue]);
  
    return (
      <Autocomplete
      id="google-map-demo"
      sx={{ width: 300 }}
      getOptionLabel={(option) =>
        typeof option.node.handle === 'string' ? option.node.handle : option.node.handle
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No locations"
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
          label="Add a location"
          fullWidth 
        />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Grid 
              container 
              alignItems="center"
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
    );
  }