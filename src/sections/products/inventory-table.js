import { useCallback, useEffect, useState, Fragment } from "react";
import { format } from "date-fns-tz";
import Link from 'next/link'
import {
  Box,
  Stack,
  Card,
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
import { inventoryHead } from "src/data/tableList";

import TableLoading from "src/components/table-loading";
import { ImageComponent } from "src/components/image";

const InventoryTable = (props) => {
  const {
    products,
    handlePageChange,
    setSelectedFilter,
    setSelectedVariantFilter,
    setCursor,
    selectedFilter,
    selectedVariantFilter,
    totalProducts,
    page,
    productPerPage,
  } = props;
  const [expand, setExpand] = useState(-1);

  const handleRowExpand = (i) => {
    if (expand === i) {
      setExpand(-1);
    } else {
      setExpand(i);
    }
  };
  const childRowStyle = (i, childHead) => {
    let borderBottomStyle = "1px solid #f1f1f1";
    if (childHead) {
      borderBottomStyle = "1px solid #c7c7c7";
    }
    return {
      padding: expand === i ? "5px 16px" : 0,
      borderBottom: expand === i ? borderBottomStyle : "none",
      background: expand === i ? "#f8f9fa" : "#fff",
    };
  };

  const InvenotryQty = ({ data, selected }) => {
    const qty = data.find((item) => item.name === selected);
    return qty.quantity;
  };

  const InvenotryProductQty = ({ data, selected }) => {
    let qtySum = 0;
    data.forEach((x) => {
      const qty = x.node.inventoryItem.inventoryLevel.quantities.find(
        (item) => item.name === selected
      );
      qtySum += qty?.quantity ? qty.quantity : 0;
    });
    //
    return qtySum;
  };

  return (
    <Box>
      <Grid lg={12} sx={{ mt: 2 }}>
        <Card>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ padding: "5px 16px" }}>
                    No
                  </TableCell>
                  {inventoryHead.map((head) => {
                    return (
                      <TableCell
                        key={head.title}
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {head.title}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.edges.map((item, i) => (
                  <Fragment key={item.node.id}>
                    <TableRow
                      onClick={() => handleRowExpand(i)}
                      sx={{ cursor: "pointer", background: expand === i ? "#f8f9fa" : "#fff" }}
                    >
                      <TableCell padding="checkbox" sx={{ padding: "5px 16px" }}>
                        <Typography sx={{ fontWeight: "bold" }} variant="body2">
                          {page * productPerPage + i + 1}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: "600px", padding: "5px 16px" }}>
                      <Link href={`/products/${item.node.handle}?inventory=yes`}>
                        <Stack direction={"row"} alignItems={"center"}>
                          <Box sx={{ position: "relative", width: "50px", height: "50px", mr: 1 }}>
                            <ImageComponent
                              img={item.node.featuredImage?.url}
                              title={item.node.title}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            {item.node.title}
                          </Typography>
                        </Stack>
                        </Link>
                      </TableCell>
                      <TableCell sx={{ padding: "0 16px" }}></TableCell>
                      <TableCell sx={{ padding: "0 16px" }}>
                        <Collapse in={expand === i ? false : true}>
                          <Typography variant="body2" sx={{ textAlign: "center" }}>
                            <InvenotryProductQty
                              data={item.node.variants?.edges}
                              selected="committed"
                            />
                          </Typography>
                        </Collapse>
                      </TableCell>
                      <TableCell sx={{ padding: "0 16px" }}>
                        <Collapse in={expand === i ? false : true}>
                          <Typography variant="body2" sx={{ textAlign: "center" }}>
                            <InvenotryProductQty
                              data={item.node.variants?.edges}
                              selected="available"
                            />
                          </Typography>
                        </Collapse>
                      </TableCell>
                      <TableCell sx={{ padding: "0 16px" }}>
                        <Collapse in={expand === i ? false : true}>
                          <Typography variant="body2" sx={{ textAlign: "center" }}>
                            <InvenotryProductQty
                              data={item.node.variants?.edges}
                              selected="on_hand"
                            />
                          </Typography>
                        </Collapse>
                      </TableCell>
                      <TableCell sx={{ padding: "0 16px" }}>
                        <Collapse in={expand === i ? false : true}>
                          <Typography variant="body2" sx={{ textAlign: "center" }}>
                            <InvenotryProductQty
                              data={item.node.variants?.edges}
                              selected="incomming"
                            />
                          </Typography>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          padding: 0,
                          border: "none",
                          background: expand === i ? "#f8f9fa" : "#fff",
                        }}
                      ></TableCell>
                      <TableCell sx={childRowStyle(i, true)}>
                        <Collapse in={expand === i ? true : false}>
                          <Typography variant="body2" sx={{ paddingLeft: 4, textAlign: "center" }}>
                            OPTION NAME
                          </Typography>
                        </Collapse>
                      </TableCell>
                      <TableCell sx={childRowStyle(i, true)}>
                        <Collapse in={expand === i ? true : false}>
                          <Typography
                            variant="body2"
                            sx={{ textAlign: "center", fontSize: "12px" }}
                          >
                            SKU
                          </Typography>
                        </Collapse>
                      </TableCell>
                      <TableCell sx={childRowStyle(i, true)}>
                        <Collapse in={expand === i ? true : false}>
                          <Typography
                            variant="body2"
                            sx={{ textAlign: "center", fontSize: "12px" }}
                          >
                            COMMITTED
                          </Typography>
                        </Collapse>
                      </TableCell>
                      <TableCell sx={childRowStyle(i, true)}>
                        <Collapse in={expand === i ? true : false}>
                          <Typography
                            variant="body2"
                            sx={{ textAlign: "center", fontSize: "12px" }}
                          >
                            AVAILABLE
                          </Typography>
                        </Collapse>
                      </TableCell>
                      <TableCell sx={childRowStyle(i, true)}>
                        <Collapse in={expand === i ? true : false}>
                          <Typography
                            variant="body2"
                            sx={{ textAlign: "center", fontSize: "12px" }}
                          >
                            ON HAND
                          </Typography>
                        </Collapse>
                      </TableCell>
                      <TableCell sx={childRowStyle(i, true)}>
                        <Collapse in={expand === i ? true : false}>
                          <Typography
                            variant="body2"
                            sx={{ textAlign: "center", fontSize: "12px" }}
                          >
                            INCOMING
                          </Typography>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    {item.node.variants?.edges.length > 0 &&
                      item.node.variants?.edges.map((varItem, idx) => {
                        return (
                          <TableRow key={idx + "-" + varItem.node.id} hover>
                            <TableCell
                              sx={{
                                padding: 0,
                                border: "none",
                                background: expand === i ? "#f8f9fa" : "#fff",
                              }}
                            ></TableCell>
                            <TableCell sx={childRowStyle(i)}>
                              <Collapse in={expand === i ? true : false}>
                                <Typography variant="body2" sx={{ paddingLeft: 7 }}>
                                  {varItem.node.title}
                                </Typography>
                              </Collapse>
                            </TableCell>
                            <TableCell sx={childRowStyle(i)}>
                              <Collapse in={expand === i ? true : false}>
                                <Typography variant="body2" sx={{ textAlign: "center" }}>
                                  {varItem.node.sku}
                                </Typography>
                              </Collapse>
                            </TableCell>
                            <TableCell sx={childRowStyle(i)}>
                              <Collapse in={expand === i ? true : false}>
                                <Typography variant="body2" sx={{ textAlign: "center" }}>
                                  <InvenotryQty
                                    data={varItem.node.inventoryItem.inventoryLevel.quantities}
                                    selected="committed"
                                  />
                                </Typography>
                              </Collapse>
                            </TableCell>
                            <TableCell sx={childRowStyle(i)}>
                              <Collapse in={expand === i ? true : false}>
                                <Typography variant="body2" sx={{ textAlign: "center" }}>
                                  <InvenotryQty
                                    data={varItem.node.inventoryItem.inventoryLevel.quantities}
                                    selected="available"
                                  />
                                </Typography>
                              </Collapse>
                            </TableCell>
                            <TableCell sx={childRowStyle(i)}>
                              <Collapse in={expand === i ? true : false}>
                                <Typography variant="body2" sx={{ textAlign: "center" }}>
                                  <InvenotryQty
                                    data={varItem.node.inventoryItem.inventoryLevel.quantities}
                                    selected="on_hand"
                                  />
                                </Typography>
                              </Collapse>
                            </TableCell>
                            <TableCell sx={childRowStyle(i)}>
                              <Collapse in={expand === i ? true : false}>
                                <Typography variant="body2" sx={{ textAlign: "center" }}>
                                  {varItem.node.inventoryItem.inventoryLevel.scheduledChanges.nodes
                                    .length > 0
                                    ? varItem.node.inventoryItem.inventoryLevel.scheduledChanges.nodes.map(
                                        (qty) =>
                                          `${qty.quantity} at ${format(
                                            new Date(qty.expectedAt),
                                            "MM-dd-yyyy"
                                          )}`
                                      )
                                    : "-"}
                                </Typography>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
      <TablePagination
        component="div"
        count={totalProducts}
        onPageChange={handlePageChange}
        page={page}
        rowsPerPage={productPerPage}
        rowsPerPageOptions={[productPerPage]}
      />
    </Box>
  );
};

export default InventoryTable;
