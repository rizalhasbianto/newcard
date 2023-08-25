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
import OptionsComponent from 'src/components/products/options'
import ProductionList from 'src/components/quotes/quote-product-list'
import EditProductItem from 'src/components/quotes/quote-edit-product'

export default function StickyHeadTable({ quotesList }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(10);
  const [editProduct, setEditProduct] = useState("");
  const [editProductIndex, setEditProductIndex] = useState(false);
  const modalPopUp = usePopover();

  useEffect(() => {
    const countSubtotal = (quotesList.reduce((n, { total }) => n + total, 0)).toFixed(2)
    const tax = (countSubtotal * 0.1).toFixed(2)
    const total = Number(countSubtotal) + Number(tax)
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

  const handleEditProd = useCallback(
    (item, index) => {
      const productId = item.product.id
      modalPopUp.handleGetProduct(productId);
      console.log("modalPopUp.productData", modalPopUp.productData)
      setEditProductIndex(index)
    },
    [modalPopUp]
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
                      key={index + 1}
                    />
                    :
                    <ProductionList
                      quote={quote}
                      handleOpenProd={handleOpenProd}
                      handleEditProd={handleEditProd}
                      key={index + 1}
                      index={index}
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