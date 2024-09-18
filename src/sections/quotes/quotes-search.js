import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, InputAdornment, OutlinedInput, TextField, MenuItem, SvgIcon } from "@mui/material";
import { Stack } from "@mui/system";

const QuotesSearch = ({ setSearch, handleQuoteQuery, query }) => {
  const statusVal = query?.status ? query?.status : ""
  const handleChange = (event) => {
    setSearch(event.target.value);
  };
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={"row"} spacing={2}>
        <OutlinedInput
          defaultValue=""
          placeholder="Search quote by id or company"
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
          sx={{ maxWidth: 500, minWidth: 300 }}
          onChange={handleChange}
        />
        <TextField
          name="quote-status"
          label="Filter by status"
          select
          onChange={handleQuoteQuery}
          sx={{ maxHeight: 250, width: "17%" }}
          value={statusVal}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="open">
            <em>Open</em>
          </MenuItem>
          <MenuItem value="new">
            <em>New</em>
          </MenuItem>
        </TextField>
      </Stack>
    </Card>
  );
};

export default QuotesSearch;
