import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  SvgIcon
} from '@mui/material';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';

export const QuotesTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => { },
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  Id
                </TableCell>
                <TableCell>
                  Ship To
                </TableCell>
                <TableCell>
                  Quote Info
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Last update
                </TableCell>
                <TableCell>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((quote) => {
                const isSelected = selected.includes(quote.id);
                const lastUpdate = format(quote.lastUpdate, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={quote.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(quote.id);
                          } else {
                            onDeselectOne?.(quote.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        #{quote.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="top"
                        direction="row"
                        spacing={2}
                      >
                        <Avatar src={quote.shipTo.avatar}>
                          {getInitials(quote.shipTo.company)}
                        </Avatar>
                        <Stack
                          alignItems="left"
                          direction="column"
                          spacing={0}
                        >
                          <Typography variant="subtitle2">
                            {quote.shipTo.company}
                          </Typography>
                          <Typography variant="subtitle2">
                            {quote.shipTo.city}
                          </Typography>
                          <Typography variant="subtitle2">
                            {quote.shipTo.zip}
                          </Typography>
                          <Typography variant="subtitle2">
                            {quote.shipTo.phone}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="left"
                        direction="column"
                        spacing={1}
                      >
                        <Typography variant="subtitle2">
                          Total: ${quote.quoteInfo.total}
                        </Typography>
                        <Typography variant="subtitle2">
                          Number of Item: {quote.quoteInfo.item}
                        </Typography>
                        <Typography variant="subtitle2">
                          Category: {quote.quoteInfo.cat}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {quote.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {lastUpdate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                      >
                        <SvgIcon
                          color="action"
                          fontSize="small"
                        >
                          <PencilIcon />
                        </SvgIcon>
                        <SvgIcon
                          color="action"
                          fontSize="small"
                        >
                          <TrashIcon />
                        </SvgIcon>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

QuotesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
