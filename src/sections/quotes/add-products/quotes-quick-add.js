import {
  Box,
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
  SvgIcon,
  Skeleton,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AlertDialog from "src/components/alert-dialog";
import TableLoading from "src/components/table-loading";

import { useCallback, useEffect, useState, Fragment } from "react";
import { Scrollbar } from "src/components/scrollbar";
import { quotesQuickAddHead } from "src/data/tableList";
import { GetProductsMeta } from "src/service/use-shopify";
import { topFilterList } from "src/data/quickAddFilterList";
import { GetProductsShopify } from "src/service/use-shopify";
import { addQuote } from "src/helper/handleAddQuote";
import { usePopover } from "src/hooks/use-popover";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

export const QuickAddProducts = ({ quotesList, setQuotesList }) => {
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
  const productPerPage = 5;
  const modalPopUp = usePopover();

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
      const filterData = {...newSelectedFilter}
      filterData.productName = `${newSelectedFilter.productName}*`
      const resData = await GetProductsShopify(filterData, productPerPage);
      if (resData) {
        setProdList(resData.newData.edges);
        if (resData.newData.pageInfo.hasNextPage) {
          setLastCursor(resData?.newData?.edges?.at(-1)?.cursor);
        } else {
          setLastCursor()
        }
      }
    },
    [selectedFilter]
  );

  //initial load prod data
  useEffect(() => {
    handleFilterChange();
  }, []);

  const handleLoadMore = useCallback(async () => {
    setLoadMoreLoading(true);
    const nextPageIndex = pageIndex + 1
    const resData = await GetProductsShopify(selectedFilter, productPerPage, lastCursor, nextPageIndex);
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

  async function fetchData() {
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
  }

  const handleAddQty = (qty, id) => {
    const checkQtyList = qtyList.findIndex((item) => item.id === id);
    const qtyNum = !qty || qty <= 0 ? 1 : qty;
    if (checkQtyList >= 0) {
      const updateQty = [...qtyList];
      updateQty[checkQtyList].qty = qtyNum;
      setQtyList(updateQty);
    } else {
      setQtyList([
        ...qtyList,
        {
          id: id,
          qty: qty,
        },
      ]);
    }
  };

  const handleAddQuote = (item, varItem, loadingIdx) => {
    const qty = qtyList.find((item) => item.id === varItem.node.id);
    const selectedProduct = item;
    const selectedVariant = varItem.node;
    const selectedQuantity = qty ? qty.qty : 1;
    addQuote({
      quotesList,
      setQuotesList,
      selectedProduct,
      selectedVariant,
      selectedQuantity,
      modalPopUp,
    });
    setAddQuoteLoading(loadingIdx);
    setTimeout(() => {
      setAddQuoteLoading();
    }, 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        borderTop: "2px solid",
        paddingTop: "20px",
      }}
    >
      <AlertDialog
        title={modalPopUp.message.title}
        content={modalPopUp.message.content}
        open={modalPopUp.open}
        handleClose={modalPopUp.handleClose}
      />
      <Grid container>
        <Grid lg={4}>
          <TextField
            id="productName"
            name="productName"
            label="Product Name"
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
      <Grid lg={12}>
        {!prodList ? (
          <TableLoading />
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {quotesQuickAddHead.map((head) => {
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
                {prodList.map((item, i) => (
                  <Fragment key={item.node.id}>
                    <TableRow sx={{ backgroundColor: "#ececec" }}>
                      <TableCell padding="checkbox">
                        <Typography sx={{ fontWeight: "bold" }}>{i + 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: "bold" }}>{item.node.title}</Typography>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    {item.node.variants?.edges.map((varItem, idx) => {
                      const findQty = qtyList.findIndex((qtyItem) => qtyItem.id === varItem.node.id);
                      const qty = findQty >= 0 ?  qtyList[findQty].qty : 1
                      return (
                      <TableRow key={varItem.node.id}>
                        <TableCell padding="checkbox" sx={{ minWidth: "70px" }}>
                          <Typography display={"inline-block"} sx={{ fontWeight: "bold" }}>
                            {i + 1}.
                          </Typography>
                          <Typography display={"inline-block"}>{idx + 1}</Typography>
                        </TableCell>
                        <TableCell sx={{ padding: "0 0px 0 40px" }}>
                          -- {varItem.node.title}
                        </TableCell>
                        <TableCell sx={{ padding: "0 16px" }}>
                          ${varItem.node.price.amount}
                        </TableCell>
                        <TableCell sx={{ padding: "0 16px" }}>
                          {!varItem.node.currentlyNotInStock ? "In stock" : "Out of stock"}
                        </TableCell>
                        <TableCell sx={{ padding: "0 16px" }}>
                          <TextField
                            placeholder="Qty"
                            variant="standard"
                            InputProps={{ inputProps: { min: 1 } }}
                            type="number"
                            value={qty}
                            onChange={(event) => {
                              handleAddQty(parseInt(event.target.value), varItem.node.id);
                            }}
                            size="small"
                            sx={{
                              margin: "10px 0",
                              maxWidth: "70px",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "0 16px",
                            textAlign: "center",
                          }}
                        >
                          <SvgIcon
                            color="action"
                            fontSize="medium"
                            onClick={() => handleAddQuote(item, varItem, `${i}${idx}`)}
                            sx={{ cursor: "pointer" }}
                          >
                            {addQuoteLoading === `${i}${idx}` ? (
                              <PlaylistAddCheckIcon sx={{ color: "green" }} />
                            ) : (
                              <PlaylistAddIcon />
                            )}
                          </SvgIcon>
                        </TableCell>
                      </TableRow>
                    )})}
                  </Fragment>
                ))}
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
    </Box>
  );
};
