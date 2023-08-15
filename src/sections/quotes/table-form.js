import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState, useCallback } from 'react';

const columns = [
  { id: 'productname', label: 'Product Name', minWidth: 170 },
  { id: 'qty', label: 'Quantity', minWidth: 100 },
  {
    id: 'availability',
    label: 'Availability',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'size',
    label: 'Price',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'density',
    label: 'Total',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'action',
    label: 'action',
    minWidth: 170,
    align: 'right'
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
];

console.log("rows", rows)

export default function StickyHeadTable({quotesList}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  useEffect(() => {
    console.log("quotesList", quotesList)
  }, [quotesList]);
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {quotesList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((quote, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell>
                      {quote.variant.title}
                    </TableCell>
                    <TableCell>
                      {quote.qty}
                    </TableCell>
                    <TableCell>
                      {quote.variant.currentlyNotInStock ? "In Stock" : "Out of Stock"}
                    </TableCell>
                    <TableCell>
                      ${quote.variant.price.amount}
                    </TableCell>
                    <TableCell>
                      ${quote.variant.price.amount}
                    </TableCell>
                    <TableCell>
                      action
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}