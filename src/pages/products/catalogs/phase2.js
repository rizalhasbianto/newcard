import { useCallback, useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GetCatalogSwr } from "src/service/use-mongo";
import { GetProductsPaginate } from "src/service/use-shopify";

import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  Slide,
  Collapse,
  Unstable_Grid2 as Grid,
  Button,
} from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CatalogInfo from "src/sections/catalog/catalog-info";
import CatalogPriceRule from "src/sections/catalog/catalog-price-rule";
import CatalogSelectedProducts from "src/sections/catalog/catalog-selected-products";
import CatalogProductList from "src/sections/catalog/catalog-products-list";
import CatalogCompany from "src/sections/catalog/catalog-company";
import TableLoading from "src/components/table-loading";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [productPerPage, setProductPerPage] = useState(10);
  const [cursor, setCursor] = useState({ lastCursor: "" });
  const [pageInfo, setPageInfo] = useState();
  const [productList, setProductList] = useState();

  const [editStatus, setEditStatus] = useState(false);
  const { data: session } = useSession();
  const catalogId = router.query?.catalogId;

  const {
    data: catalog,
    isLoading,
    isError,
  } = GetCatalogSwr({
    page: 0,
    postPerPage: 1,
    query: { id: catalogId },
  });

  const {
    data: product,
    isLoading: prodLoading,
    isError: prodError,
    mutate,
  } = GetProductsPaginate({
    productPerPage,
    catalogId,
    cursor: cursor,
  });

  useEffect(() => {
    if (product) {
      setPageInfo(product.newData.pageInfo);
      setProductList(product);
    }
  }, [product]);

  // SAVE BUTTON
  const options = ['Publish', 'Update'];
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (
    event,
    index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    setOpen(false);
  };

  return (
    <>
      <Head>
        <title>Catalog | Skratch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          {catalog && (
            <Box>
              <CatalogInfo session={session} catalog={catalog.data[0]} />
              <CatalogCompany session={session} catalog={catalog.data[0]} />
              <CatalogPriceRule session={session} catalog={catalog.data[0]} />
              {!productList && <TableLoading />}
              {(prodError || (productList && productList.newData.totalCount === 0)) && (
                <Collapse in={!editStatus}>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <Typography variant="subtitle1" textAlign={"center"}>
                          No product found!
                        </Typography>
                        <Button variant="outlined" onClick={() => setEditStatus(true)}>
                          Select a product
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Collapse>
              )} 
              <Collapse in={!editStatus}>
                {productList && productList.newData.totalCount > 0 && (
                  <CatalogSelectedProducts
                    prodList={productList}
                    page={page}
                    productPerPage={productPerPage}
                    productCount={productList.newData.totalCount}
                    pageInfo={pageInfo}
                    setProductPerPage={setProductPerPage}
                    setPage={setPage}
                    setCursor={setCursor}
                    setEditStatus={setEditStatus}
                    prodLoading={prodLoading}
                  />
                )}
              </Collapse>
              <Collapse in={editStatus}>
                <CatalogProductList
                  catalog={catalog.data[0]}
                  setEditStatus={setEditStatus}
                  productMutate={mutate}
                />
              </Collapse>
              <Card>
                <CardContent>
                  <Stack
                    spacing={1}
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Typography variant="subtitle1" textAlign={"center"}>
                      Status: Draft
                    </Typography>
                    <ButtonGroup
                      variant="contained"
                      ref={anchorRef}
                      aria-label="Button group with a nested menu"
                    >
                      <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                      <Button
                        size="small"
                        aria-controls={open ? "split-button-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                      >
                        <ArrowDropDownIcon />
                      </Button>
                    </ButtonGroup>
                    <Popper
                      sx={{
                        zIndex: 1,
                      }}
                      open={open}
                      anchorEl={anchorRef.current}
                      role={undefined}
                      transition
                      disablePortal
                    >
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin:
                              placement === "bottom" ? "center top" : "center bottom",
                          }}
                        >
                          <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                              <MenuList id="split-button-menu" autoFocusItem>
                                {options.map((option, index) => (
                                  <MenuItem
                                    key={option}
                                    disabled={index === 2}
                                    selected={index === selectedIndex}
                                    onClick={(event) => handleMenuItemClick(event, index)}
                                  >
                                    {option}
                                  </MenuItem>
                                ))}
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
