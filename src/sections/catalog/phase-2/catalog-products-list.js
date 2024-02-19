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
  const [addedProductList, setAddedProductList] = useState([]);
  const productPerPage = 10;
  const modalPopUp = usePopover();

  //initial load prod data
  useEffect(() => {
    handleFilterChange();
    getFilterOpt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = useCallback(
    async (event) => {
      let newSelectedFilter = selectedFilter;
      if (event) {
        newSelectedFilter = {
          ...selectedFilter,
          [event.target.name]: event.target.value,
        };
      }

      setSelectedFilter(newSelectedFilter);
      const filterData = { ...newSelectedFilter };
      filterData.productName = `${newSelectedFilter.productName}*`;
      const resData = await GetProductsShopify(filterData, productPerPage);
      if (resData) {
        setProdList(resData.newData.edges);
        if (resData.newData.pageInfo.hasNextPage) {
          setLastCursor(resData?.newData?.edges?.at(-1)?.cursor);
        } else {
          setLastCursor();
        }
      }
    },
    [selectedFilter]
  );

  const handleLoadMore = useCallback(async () => {
    setLoadMoreLoading(true);
    const nextPageIndex = pageIndex + 1;
    const resData = await GetProductsShopify(
      selectedFilter,
      productPerPage,
      lastCursor,
      nextPageIndex
    );
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
  }, [lastCursor, pageIndex, prodList, selectedFilter]);

  const getFilterOpt = useCallback(async () => {
    const newFilterOpt = {
      collection: [],
      productType: [],
      productVendor: [],
      tag: [],
    };

    const resCollection = await GetProductsMeta("collections");
    const resProdType = await GetProductsMeta("prodType");
    const resProdVendor = await GetProductsMeta("prodVendor");
    const resProdTag = await GetProductsMeta("prodTag");

    if (resCollection) {
      const orderedCollection = resCollection.newData.data.collections.edges.map(
        (collection) => collection.node.handle
      );
      newFilterOpt.collection = orderedCollection;
    }
    if (resProdType) {
      const orderedProdType = resProdType.newData.data.productTypes.edges.map(
        (prodType) => prodType.node && prodType.node
      );
      newFilterOpt.productType = orderedProdType;
    }
    if (resProdVendor) {
      const orderedProdVendor = resProdVendor.newData.data.shop.productVendors.edges.map(
        (prodVendor) => prodVendor.node && prodVendor.node
      );
      newFilterOpt.productVendor = orderedProdVendor;
    }
    if (resProdTag) {
      const orderedProdTag = resProdTag.newData.data.productTags.edges.map(
        (prodTag) => prodTag.node && prodTag.node
      );
      newFilterOpt.tag = orderedProdTag;
    }
    setFilterOpt(newFilterOpt);
  }, []);

  const handleAddToCatalog = async (shopifyCatalog, productId, catalogId, i) => {
    setAddCatalogLoading(i);

    const resUpdateMetafield = await UpdateProductMetafield({
      productId: productId,
      catalogId: catalogId,
      shopifyCatalog: shopifyCatalog
    });

    if (
      !resUpdateMetafield ||
      resUpdateMetafield.updateMetafield.data.productUpdate.userErrors.length > 0
    ) {
      setAddCatalogLoading();
      return;
    }

    setAddedProductList([...addedProductList, productId]);
    setAddCatalogLoading();
  };

  return (
    <Card>
      <Grid container alignItems="center">
      <Grid xl={6}>
          <CardHeader subheader={`Add product for this catalog`} title="Selecte a Products" />
        </Grid>
        <Grid xl={6} justify="flex-end" sx={{
                textAlign: "right",
                paddingRight: "25px",
              }}>
          <Button variant="outlined" sx={{mt:2}} onClick={() => {
            setEditStatus(false) 
            productMutate()
            }}>Done</Button>
        </Grid>
      </Grid>
      <CardContent sx={{pt:0}}>
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
