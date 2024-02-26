import { useCallback, useEffect, useState, Fragment } from "react";

import {
  Box,
  Card,
  CardHeader,
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
  Button,
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
import { GetProductsShopify, UpdateProductMetafield } from "src/service/use-shopify";
import { addQuote } from "src/helper/handleAddQuote";
import { usePopover } from "src/hooks/use-popover";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

const CatalogProductList = (props) => {
  const { catalog, setEditStatus, productMutate } = props;
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
  const [addCatalogLoading, setAddCatalogLoading] = useState();
  const productPerPage = 10;
  const modalPopUp = usePopover();

  const handleLoadMore = useCallback(async () => {
    setLoadMoreLoading(true);
    const nextPageIndex = pageIndex + 1;
    const resData = await GetProductsShopify();
    if (resData) {
      setProdList([...prodList, ...resData.newData.edges]);
      setLoadMoreLoading(false);
      if (resData.newData.pageInfo.hasNextPage) {
        setLastCursor(resData?.newData?.edges?.at(-1)?.cursor);
        setPageIndex(nextPageIndex);
      } else {
        setLastCursor();
      }
    }
  }, [pageIndex, prodList]);

  const handleAddToCatalog = async () => {

  };

  return (
    <Card sx={{mb:2}}>
      <Grid container alignItems="center">
      <Grid xl={6}>
          <CardHeader subheader={`Add product for this catalog`} title="Selected Products" />
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
                    
                    const catalogIDs = item.node.shopifyCatalog?.value ? JSON.parse(item.node.shopifyCatalog?.value) : []

                    return (
                      <Fragment key={item.node.id}>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Typography>{i + 1}</Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction={"row"} alignItems={"center"}>
                              <Box
                                sx={{ position: "relative", width: "50px", height: "50px", mr: 1 }}
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
                          <TableCell>
                            {catalogIDs.includes(catalog._id) ? (
                              <Box sx={{ textAlign: "center" }}>
                                <PlaylistAddCheckIcon sx={{ color: "green" }}/>
                              </Box>
                            ) : (
                              <LoadingButton
                                variant="outlined"
                                color="primary"
                                loading={addCatalogLoading === i ? true : false}
                                loadingPosition="start"
                                startIcon={<PlaylistAddIcon />}
                                onClick={() => handleAddToCatalog(item.node.shopifyCatalog, item.node.id, catalog._id, i)}
                              >
                                Add
                              </LoadingButton>
                            )}
                          </TableCell>
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
                        colSpan="7"
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
        <Grid lg={12} sx={{ mt: 2 }}>

        </Grid>
      </CardContent>
    </Card>
  );
};

export default CatalogProductList;
