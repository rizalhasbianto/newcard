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
  TextField,
  MenuItem,
  Typography,
  Stack,
  SvgIcon,
  Skeleton,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AlertDialog from "src/components/alert-dialog";
import TableLoading from "src/components/table-loading";
import { Scrollbar } from "src/components/scrollbar";
import { ImageComponent } from "src/components/image";

import { catalogProductListHead } from "src/data/tableList";
import { GetProductsMeta } from "src/service/use-shopify";
import { topFilterList } from "src/data/quickAddFilterList";
import { GetProductsShopify } from "src/service/use-shopify";
import { addQuote } from "src/helper/handleAddQuote";
import { usePopover } from "src/hooks/use-popover";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

const CatalogProductList = ({ quotesList, setQuotesList }) => {
  const [selectedFilter, setSelectedFilter] = useState({
    productName: "",
    collection: "",
    productType: "",
    productVendor: "",
    tag: "",
  });
  const [filterOpt, setFilterOpt] = useState();
  const [prodList, setProdList] = useState([]);
  const [lastCursor, setLastCursor] = useState();
  const [pageIndex, setPageIndex] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [qtyList, setQtyList] = useState([]);
  const [addQuoteLoading, setAddQuoteLoading] = useState();
  const productPerPage = 10;
  const modalPopUp = usePopover();


  //initial load prod data
  useEffect(() => {

  }, []);



  useEffect(() => {
    
  }, []);
  console.log("prodList", prodList);
  return (
    <Card>
      <CardContent>
        <AlertDialog
          title={modalPopUp.message.title}
          content={modalPopUp.message.content}
          open={modalPopUp.open}
          handleClose={modalPopUp.handleClose}
        />
        <Grid container spacing={2}>
          <Grid lg={4}>
            <TextField
              id="productName"
              name="productName"
              label="Product Name"
              variant="outlined"
              value={selectedFilter.productName}
              fullWidth
              onChange={handleFilterChange}
            />
          </Grid>
          {!filterOpt ? (
            <Skeleton
              variant="rectangular"
              width={162}
              height={55}
              sx={{ marginTop: "12px", borderRadius: "5px" }}
            />
          ) : (
            topFilterList.map((filter) => {
              return (
                filterOpt && (
                  <Grid lg={2} key={filter.id}>
                    <TextField
                      id={filter.id}
                      name={filter.id}
                      label={filter.title}
                      variant="outlined"
                      value={selectedFilter[filter.id]}
                      select
                      fullWidth
                      onChange={handleFilterChange}
                      sx={{ maxHeight: 250 }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {filterOpt[filter.id]?.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )
              );
            })
          )}
        </Grid>
        <Grid lg={12} sx={{ mt: 2 }}>
          {!prodList ? (
            <TableLoading />
          ) : (
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="sticky table">
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
                  {prodList.map((item, i) => {
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
                            <Typography>{i + 1}</Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction={"row"} alignItems={"center"}>
                              <Box sx={{ position: "relative", width: "50px", height: "50px", mr:1 }}>
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
                          <TableCell></TableCell>
                        </TableRow>
                      </Fragment>
                    );
                  })}
                </TableBody>
                {lastCursor && (
                  <TableFooter>
                    <TableRow>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                        variant="footer"
                        colSpan="6"
                      >
                        <LoadingButton
                          color="primary"
                          onClick={() => handleLoadMore()}
                          loading={loadMoreLoading}
                          loadingPosition="start"
                          startIcon={<AutorenewIcon />}
                          variant="contained"
                        >
                          LOAD MORE
                        </LoadingButton>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </TableContainer>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CatalogProductList;
