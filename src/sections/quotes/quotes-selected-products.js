import { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Container } from '@mui/system';
import { columns } from 'src/data/selected-prod-column'
import { usePopover } from 'src/hooks/use-popover';
import ProductModal from 'src/components/products/product-modal'
import Lineitem from 'src/components/quotes/quote-line-item'
import EditProductItem from 'src/components/quotes/edit-line-item'

export default function LineItemQuotes({ quotesList, setQuotesList }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(10);
  const [editProductIndex, setEditProductIndex] = useState("");
  const modalPopUp = usePopover();

  useEffect(() => {
    const countSubtotal = (quotesList.reduce((n, { total }) => n + Number(total), 0)).toFixed(2)
    const tax = (countSubtotal * 0.1).toFixed(2)
    const total = (Number(countSubtotal) + Number(tax)).toFixed(2)
    setTotal({
      subTotal: countSubtotal,
      tax,
      total
    })
  }, [quotesList]);

  const handleChangePage = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      setPage(0)
      setRowsPerPage(event.target.value);
    },
    []
  );

  const handleOpenProd = useCallback(
    (item) => {
      const productId = item.product.id
      modalPopUp.handleGetProduct(productId);
      modalPopUp.handleOpen();
    },
    [modalPopUp]
  );

  const handleEditLineitem = useCallback(
    (item, index) => {
      const productId = item.product.id
      modalPopUp.handleGetProduct(productId);
      setEditProductIndex(index)
    },
    [modalPopUp]
  );

  const handleDeleteProd = useCallback(
    (index) => {
      setQuotesList(
        quotesList.filter((a,i) =>
          i !== index
        )
      )
    },
    [quotesList, setQuotesList]
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <ProductModal
        content={modalPopUp.productData}
        open={modalPopUp.open}
        handleClose={modalPopUp.handleClose}
      />
      <TableContainer sx={{ maxHeight: 600 }}>
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
                  modalPopUp.productData && editProductIndex === index ?
                    <EditProductItem
                      quote={quote}
                      productData={modalPopUp.productData}
                      index={index}
                      key={index + 1}
                      quotesList={quotesList}
                      setQuotesList={setQuotesList}
                      setEditProductIndex={setEditProductIndex}
                    />
                    :
                    <Lineitem
                      quote={quote}
                      handleOpenProd={handleOpenProd}
                      handleEditLineitem={handleEditLineitem}
                      handleDeleteProd={handleDeleteProd}
                      index={index}
                      key={index + 1}
                    />
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