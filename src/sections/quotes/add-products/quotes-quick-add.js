import { useCallback, useEffect, useState, Fragment } from "react";
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
  Collapse,
  TablePagination,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AlertDialog from "src/components/alert-dialog";
import TableLoading from "src/components/table-loading";
import { ImageComponent } from "src/components/image";
import ProductsSearch from "src/sections/products/products-search";

import { Scrollbar } from "src/components/scrollbar";
import { quotesQuickAddHead } from "src/data/tableList";
import { GetProductsMeta } from "src/service/use-shopify";
import { topFilterList } from "src/data/quickAddFilterList";
import { GetProductsShopify, GetProductsPaginate } from "src/service/use-shopify";
import { addQuote } from "src/helper/handleAddQuote";
import { usePopover } from "src/hooks/use-popover";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { Stack } from "@mui/system";

export const QuickAddProducts = ({ quotesList, setQuotesList, selectedCompany, session, handleSubmit }) => {
  const [selectedFilter, setSelectedFilter] = useState({
    productName: "",
    catalog: "",
    productType: "",
    productVendor: "",
    tag: "",
  });
  const [selectedVariantFilter, setSelectedVariantFilter] = useState([]);
  const [cursor, setCursor] = useState({ lastCursor: "" })
  const [page, setPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [qtyList, setQtyList] = useState([]);
  const [addQuoteLoading, setAddQuoteLoading] = useState();
  const catalogCompany = selectedCompany ? [{ id: selectedCompany.shopifyCompanyLocationId }] : [];
  const productPerPage = 5;
  const modalPopUp = usePopover();
  const [catalogID, setCatalogID] = useState([]);

  const { data, isLoading, isError } = GetProductsPaginate({
    selectedFilter,
    selectedVariantFilter,
    catalogId: selectedCompany?.catalogIDs,
    catalogCompany,
    productPerPage,
    cursor: cursor,
  });
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
      catalogCompany,
      handleSubmit
    });
    setAddQuoteLoading(loadingIdx);
    setTimeout(() => {
      setAddQuoteLoading();
    }, 3000);
  };

  const handlePageChange = useCallback(
    async (event, value) => {
      if (value > page) {
        // go to next page
        setCursor({ lastCursor: data.newData.pageInfo.endCursor });
      } else {
        // go to prev page
        setCursor({ firstCursor: data.newData.pageInfo.startCursor });
      }
      setPage(value);
    },
    [page, data]
  );

  useEffect(() => {
    if (data) {
      setTotalProducts(data?.newData.totalCount)
    }
  }, [data]);

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
      <ProductsSearch
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedVariantFilter={selectedVariantFilter}
        setSelectedVariantFilter={setSelectedVariantFilter}
        filterList={data?.newData.productFilters}
        catalogID={catalogID}
        setCatalogID={setCatalogID}
        session={session}
        quoteCompanyName={catalogCompany}
      />
      <Grid lg={12} sx={{ height: 600 }}>
        {!data || isLoading ? (
          <TableLoading />
        ) : (
          <TableContainer sx={{ height: 600 }}>
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
              <TableBody sx={{ height: "500px" }}>
                {data?.newData?.edges.map((item, i) => (
                  <Fragment key={item.node.id}>
                    <TableRow sx={{ backgroundColor: "#ececec" }}>
                      <TableCell padding="checkbox" sx={{ padding: "5px 16px" }}>
                        <Typography sx={{ fontWeight: "bold" }} variant="body2">
                          {(page * 5) + i + 1}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: "600px", padding: "5px 16px" }}>
                        <Stack direction={"row"} alignItems={"center"}>
                          <Box sx={{ position: "relative", width: "50px", height: "50px", mr: 1 }}>
                            <ImageComponent
                              img={item?.node?.variants?.edges[0]?.node?.image?.url}
                              title={item.node.title}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            {item.node.title}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ padding: "0 16px" }}></TableCell>
                      <TableCell sx={{ padding: "0 16px" }}></TableCell>
                      <TableCell sx={{ padding: "0 16px" }}></TableCell>
                      <TableCell sx={{ padding: "0 16px" }}></TableCell>
                    </TableRow>
                    {item.node.variants?.edges.map((varItem, idx) => {
                      const findQty = qtyList.findIndex(
                        (qtyItem) => qtyItem.id === varItem.node.id
                      );
                      const qty = findQty >= 0 ? qtyList[findQty].qty : 1;
                      const selectedCompanyPrice =
                        varItem.node.companyPrice?.node[
                          `company_${selectedCompany.shopifyCompanyLocationId}`
                        ].price.amount;
                      return (
                        <TableRow key={varItem.node.id}>
                          <TableCell
                            padding="checkbox"
                            sx={{ minWidth: "70px", padding: "0 16px" }}
                          >
                            <Typography
                              variant="body2"
                              display={"inline-block"}
                              sx={{ fontWeight: "bold" }}
                            >
                              {(page * 5) + i + 1}.
                            </Typography>
                            <Typography variant="body2" display={"inline-block"}>
                              {idx + 1}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ padding: "0 0px 0 40px" }}>
                            <Typography variant="body2" display={"inline-block"}>
                              -- {varItem.node.title}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ padding: "0 16px" }}>
                            {selectedCompanyPrice === varItem.node.price.amount ? (
                              <Typography variant="body2" display={"inline-block"}>
                                ${varItem.node.price.amount}
                              </Typography>
                            ) : (
                              <>
                                <Typography
                                  variant="body2"
                                  display={"inline-block"}
                                  color="#bdbdbd"
                                  sx={{ textDecoration: "line-through" }}
                                >
                                  ${varItem.node.price.amount}
                                </Typography>
                                <Typography variant="body2" display={"inline-block"}>
                                  /
                                </Typography>
                                <Typography variant="body2" display={"inline-block"}>
                                  ${selectedCompanyPrice}
                                </Typography>
                              </>
                            )}
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
                      );
                    })}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
      <TablePagination
        component="div"
        count={totalProducts}
        onPageChange={handlePageChange}
        page={page}
        rowsPerPage={5}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
};
