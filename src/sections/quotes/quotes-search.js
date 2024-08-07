import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

const QuotesSearch = ({setSearch}) => {
  const handleChange = (event) => {
    setSearch(event.target.value)
  };
return (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      defaultValue=""
      placeholder="Search quote by id or company"
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
      sx={{ maxWidth: 500, minWidth: 300 }}
      onChange={handleChange}
    />
  </Card>
)};

export default QuotesSearch