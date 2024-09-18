import { useCallback, useState, useEffect } from "react";

import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  Box,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";

const OrdersSearch = ({ setSearch, setFilter, filter }) => {
  const [value, setValue] = useState([0, 3000]);
  const handleChange = (event) => {
    setSearch(event.target.value);
  };
  const handleFilter = (event) => {
    const newFilter = {...filter}
    newFilter[event.target.name] = event.target.value
    setFilter(newFilter)
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2}>
        <OutlinedInput
          defaultValue=""
          fullWidth
          placeholder="Search by id or customer"
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
          sx={{ maxWidth: 300 }}
          onChange={handleChange}
        />
        <TextField
          name="financialStatus"
          label="Filter by financial status"
          select
          onChange={handleFilter}
          sx={{ maxHeight: 250, width: "17%" }}
          value={filter.financialStatus ? filter.financialStatus : ""}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="AUTHORIZED">
            <em>Authorized</em>
          </MenuItem>
          <MenuItem value="PAID">
            <em>Paid</em>
          </MenuItem>
          <MenuItem value="PENDING">
            <em>Pending</em>
          </MenuItem>
        </TextField>
        <TextField
          name="paymentStatus"
          label="Filter by Payment status"
          select
          onChange={handleFilter}
          sx={{ maxHeight: 250, width: "17%" }}
          value={filter.paymentStatus ? filter.paymentStatus : ""}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Overdue">
            <em>Overdue</em>
          </MenuItem>
        </TextField>
        <TextField
          name="fulfillmentStatus"
          label="Filter by fulfillment status"
          select
          onChange={handleFilter}
          sx={{ maxHeight: 250, width: "17%" }}
          value={filter.fulfillmentStatus ? filter.fulfillmentStatus : ""}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="SHIPPED">
            <em>Fulfilled</em>
          </MenuItem>
          <MenuItem value="UNFULFILLED">
            <em>Unfulfilled</em>
          </MenuItem>
        </TextField>
        <TextField
          name="status"
          label="Filter by order status"
          select
          onChange={handleFilter}
          sx={{ maxHeight: 250, width: "17%" }}
          value={filter.status ? filter.status : ""}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="OPEN">
            <em>Open</em>
          </MenuItem>
          <MenuItem value="CLOSED">
            <em>Closed</em>
          </MenuItem>
          <MenuItem value="CANCELLED">
            <em>Cancelled</em>
          </MenuItem>
        </TextField>
      </Stack>
    </Card>
  );
};

export default OrdersSearch;
