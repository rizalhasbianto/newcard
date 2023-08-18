import { useEffect, useState, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
  Typography,
  Box,
  Unstable_Grid2 as Grid
} from '@mui/material';
import Image from 'next/image'
import { Container } from '@mui/system';

const columns = [
  {
    id: 'productname',
    label: 'Product Name',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'qty',
    label: 'Quantity',
    minWidth: 100,
    align: 'center'
  },
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
    align: 'center'
  },
  {
    id: 'density',
    label: 'Total',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'action',
    label: 'action',
    minWidth: 170,
    align: 'center'
  },
];


export default function StickyHeadTable({ quotesList }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(10);

  useEffect(() => {

    const countSubtotal = quotesList.reduce((n, { total }) => n + total, 0)
    const tax = (countSubtotal * 0.1).toFixed(2)
    const total = Number(countSubtotal) + Number(tax)
    setTotal({
      subTotal: countSubtotal,
      tax,
      total
    })
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
                  style={{ minWidth: column.minWidth, textAlign: column.align }}
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
                      <Typography variant='subtitle2'>{quote.productName}</Typography>
                      <Grid container>
                        <Grid
                          xs={12}
                          md={4}
                          sx={{
                            position: "relative"
                          }}
                        >
                          <Image
                            src={quote.variant.image.url}
                            fill={true}
                            alt="Picture of the author"
                            className='shopify-fill'
                            sizes="270 640 750"
                          />
                        </Grid>
                        <Grid
                          xs={12}
                          md={8}
                        >
                          {quote.variant.selectedOptions.map((opt) => {
                            return (
                              <Typography
                                key={opt.name}
                                variant="body3"
                                sx={{
                                  display: "inline-block",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                {opt.name} : {opt.value}
                              </Typography>
                            )
                          })}
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: "center"
                        }}
                      >
                        {quote.qty}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: "center"
                        }}
                      >
                        {quote.variant.currentlyNotInStock ? "Out of Stock" : "In Stock"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: "center"
                        }}
                      >
                        ${quote.variant.price.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: "center"
                        }}
                      >
                        ${quote.total}
                      </Typography>
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
      {
        quotesList.length > 0 &&
        <Container
          sx={{
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <Box
            sx={{
              width: "300px",
            }}>
            <Grid
              container>
              <Grid
                xs={12}
                md={6}
              >
                <Typography>Subtotal:</Typography>
                <Typography>Shipping:</Typography>
                <Typography>Tax:</Typography>
                <Typography
                  variant='subtitle1'
                  sx={{
                    borderTop: "1px solid #fff"
                  }}
                >
                  Total:
                </Typography>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <Typography>${total.subTotal}</Typography>
                <Typography>count later</Typography>
                <Typography>${total.tax}</Typography>
                <Typography
                  variant='subtitle1'
                  sx={{
                    borderTop: "1px solid #d9d9d9"
                  }}
                >
                  ${total.total}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      }
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={quotesList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          background: "#f8f9fa"
        }}
      />
    </Paper>
  );
}