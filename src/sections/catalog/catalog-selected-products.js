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
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AlertDialog from "src/components/alert-dialog";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TableLoading from "src/components/table-loading";
import { Scrollbar } from "src/components/scrollbar";
import { ImageComponent } from "src/components/image";

import { catalogProductListHead } from "src/data/tableList";
import { usePopover } from "src/hooks/use-popover";


const CatalogSelectedProduct = (props) => {
  const { prodList, handlePageChange, handleRowsPerPageChange, page, productPerPage, productCount, setEditStatus } = props;
  const modalPopUp = usePopover();

  return (
    <Card >
      <Grid container alignItems="center">
        <Grid xl={6}>
          <CardHeader subheader={`Included ${productCount} products`} title="Selected Products" />
        </Grid>
        <Grid xl={6} justify="flex-end" sx={{
                textAlign: "right",
                paddingRight: "25px",
              }}>
          <Button variant="outlined" sx={{mt:2}} onClick={() => setEditStatus(true)}>Edit</Button>
        </Grid>
      </Grid>
      
      <CardContent sx={{pt:0}}>
        <AlertDialog
          title={modalPopUp.message.title}
          content={modalPopUp.message.content}
          open={modalPopUp.open}
          handleClose={modalPopUp.handleClose}
        />
        <Grid lg={12} sx={{ mt: 2 }}>
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
                  {prodList.newData.edges.map((item, i) => {
                    const numberItem = page * productPerPage + i + 1
                    const price =
                      item.node.priceRange.maxVariantPrice.amount ===
                      item.node.priceRange.minVariantPrice.amount
                        ? item.node.priceRange.maxVariantPrice.amount
                        : item.node.priceRange.minVariantPrice.amount +
                          " - " +
                          item.node.priceRange.maxVariantPrice.amount;
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
                          <TableCell>{item.node.variants.edges.length}</TableCell>
                          <TableCell>${price}</TableCell>
                          <TableCell>{item.node.productType}</TableCell>
                          <TableCell>{item.node.vendor}</TableCell>
                          <TableCell sx={{textAlign:"center"}}><DeleteForeverIcon sx={{cursor:"pointer"}}/></TableCell>
                        </TableRow>
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          <TablePagination
            component="div"
            count={prodList.newData.totalCount}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={page}
            rowsPerPage={productPerPage}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CatalogSelectedProduct;
