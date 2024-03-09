import { useCallback, useEffect, useState, Fragment } from "react";

import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  TableContainer,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Typography,
  Stack,
  SvgIcon,
  Skeleton,
  Unstable_Grid2 as Grid,
  CardHeader,
  Button,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AlertDialog from "src/components/alert-dialog";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TableLoading from "src/components/table-loading";
import { Scrollbar } from "src/components/scrollbar";
import { ImageComponent } from "src/components/image";

import { catalogProductListHead } from "src/data/tableList";
import { usePopover } from "src/hooks/use-popover";

const CatalogSelectedProduct = (props) => {
  const {
    productList,
    shopifyCatalog,
    setProductPerPage,
    setPage,
    page,
    productPerPage,
    prodLoading,
    setCursor,
  } = props;
  const modalPopUp = usePopover();
  const priceList = shopifyCatalog.priceList;
  const handlePageChange = useCallback(
    async (event, value) => {
      if (value > page) {
        // go to next page
        setCursor({ lastCursor: productList.newData.pageInfo.endCursor });
      } else {
        // go to prev page
        setCursor({ firstCursor: productList.newData.pageInfo.startCursor });
      }
      setPage(value);
    },
    [page, productList]
  );

  const handleRowsPerPageChange = useCallback(async (event) => {
    setPage(0);
    setProductPerPage(event.target.value);
  }, []);

  return (
    <Card sx={{ mb: 2 }}>
      <Grid container alignItems="center">
        <Grid xl={6}>
          <CardHeader
            subheader={`Included ${productList.newData.totalCount} products`}
            title="Products"
          />
        </Grid>
        <Grid
          xl={6}
          justify="flex-end"
          sx={{
            textAlign: "right",
            paddingRight: "25px",
          }}
        >
          <CardHeader
            subheader={`${priceList.parent.adjustment.type} ${priceList.parent.adjustment.value}% | Fixed price: ${priceList.fixedPricesCount} Variants`}
            title="Overall price adjustment"
          />
        </Grid>
      </Grid>

      <CardContent sx={{ pt: 0 }}>
        <AlertDialog
          title={modalPopUp.message.title}
          content={modalPopUp.message.content}
          open={modalPopUp.open}
          handleClose={modalPopUp.handleClose}
        />
        <Grid lg={12} sx={{ mt: 2, position: "relative" }}>
          <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={prodLoading ? true : false}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {catalogProductListHead.map((head) => {
                    return (
                      <TableCell
                        key={head.title}
                        sx={{
                          textAlign: "left",
                        }}
                      >
                        {head.title}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody sx={{ maxHeight: "500px" }}>
                {productList.newData.edges.map((item, i) => {
                  const numberItem = page * productPerPage + i + 1;
                  const price =
                    item.node.priceRange.maxVariantPrice.amount ===
                    item.node.priceRange.minVariantPrice.amount
                      ? "$" + item.node.priceRange.maxVariantPrice.amount
                      : "$" +
                        item.node.priceRange.minVariantPrice.amount +
                        " - " +
                        "$" +
                        item.node.priceRange.maxVariantPrice.amount;
                  let overridePrice = "-";

                  if (item.node.overridePrice) {
                    overridePrice =
                      item.node.overridePrice.maxVariantPrice.amount ===
                      item.node.overridePrice.minVariantPrice.amount
                        ? "$" + item.node.overridePrice.maxVariantPrice.amount
                        : "$" +
                          item.node.overridePrice.minVariantPrice.amount +
                          " - " +
                          "$" +
                          item.node.overridePrice.maxVariantPrice.amount;
                  }
                  return (
                    <Fragment key={item.node.id}>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Typography>{numberItem}</Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction={"row"} alignItems={"center"}>
                            <Box
                              sx={{
                                position: "relative",
                                width: "50px",
                                height: "50px",
                                mr: 1,
                              }}
                            >
                              <ImageComponent
                                img={item.node.variants?.edges[0]?.node?.image?.url}
                                title={item.node.title}
                              />
                            </Box>
                            <Typography variant="body2">{item.node.title}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell><Typography variant="body2">{item.node.variants.edges.length}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{price}</Typography></TableCell>
                        <TableCell><Typography variant="body2" sx={item.node.overrideType === "fixed" ? {borderBottom:"1px solid #e2e2e2",fontWeight:600} : {}}>{overridePrice}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{item.node.productType}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{item.node.vendor}</Typography></TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={productList.newData.totalCount}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={page}
            rowsPerPage={productPerPage}
            rowsPerPageOptions={[10, 15, 20]}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CatalogSelectedProduct;
