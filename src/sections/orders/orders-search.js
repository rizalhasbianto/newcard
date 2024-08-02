import { useCallback, useState, useEffect } from "react";

import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon, Box, Stack } from '@mui/material';


const OrdersSearch = ({setSearch}) => {
  const [value, setValue] = useState([0, 3000]);
  const handleChange = (event) => {
    setSearch(event.target.value)
  };
  return (
  <Card sx={{ p: 2 }} >
    <Stack direction="row" spacing={2}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search by id or customer"
      startAdornment={(
        <InputAdornment position="start">
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      )}
      sx={{ maxWidth: 300 }}
      onChange={handleChange}
    />
    </Stack>
  </Card>
)};

export default OrdersSearch