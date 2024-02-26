import { useCallback, useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GetCatalogSwr } from "src/service/use-mongo";
import {
  GetProductsPaginate,
  GetShopifyCatalog,
  GetSyncCatalogProducts,
  UpdateProductMetafield,
} from "src/service/use-shopify";

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
  CircularProgress,
  LinearProgress,
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
import CatalogSelectedProducts from "src/sections/catalog/catalog-selected-products";
import CatalogProductList from "src/sections/catalog/catalog-products-list";
import CatalogCompany from "src/sections/catalog/catalog-company";
import CatalogSync from "src/sections/catalog/catalog-sync";
import TableLoading from "src/components/table-loading";

const Page = () => {
  const router = useRouter();
  const [onSync, setOnSync] = useState(false);
  const [page, setPage] = useState(0);
  const [productPerPage, setProductPerPage] = useState(10);
  const [cursor, setCursor] = useState({ lastCursor: "" });
  const [pageInfo, setPageInfo] = useState();
  const [productList, setProductList] = useState();
  const { data: session } = useSession();
  const catalogId = router.query?.catalogId;

  const {
    data: mongoCatalog,
    isLoading: mongoLoading,
    isError: mongoError,
    mutate: mongoCatalogmutate,
  } = GetCatalogSwr({
    page: 0,
    postPerPage: 1,
    query: { shopifyCatalogID: catalogId },
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

  const {
    data: shopifyCatalog,
    isLoading: shopifyCatalogLoading,
    isError: shopifyCatalogError,
    isValidating: shopifyCatalogValidating,
    mutate: shopifyCatalogmutate,
  } = GetShopifyCatalog(catalogId);

  useEffect(() => {
    if (product) {
      setPageInfo(product.newData.pageInfo);
      setProductList(product);
    }
  }, [product]);

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
          {(shopifyCatalogError || mongoError || prodError) && (
            <Typography>Error loading data</Typography>
          )}
          {(shopifyCatalogLoading || mongoLoading) && <TableLoading />}
          <Box>
            <Collapse in={!onSync}>
              {shopifyCatalog &&
                mongoCatalog &&
                (mongoCatalog.data.length ? (
                  <Box>
                    <CatalogInfo
                      session={session}
                      mongoCatalog={mongoCatalog.data[0]}
                      shopifyCatalog={shopifyCatalog.newData.data.catalog}
                      setOnSync={setOnSync}
                    />
                    <CatalogCompany
                      session={session}
                      mongoCatalog={mongoCatalog.data[0]}
                      shopifyCatalog={shopifyCatalog.newData.data.catalog}
                      shopifyCatalogmutate={shopifyCatalogmutate}
                    />
                    {productList && (
                      <CatalogSelectedProducts
                        productList={productList}
                        shopifyCatalog={shopifyCatalog.newData.data.catalog}
                        productPerPage={productPerPage}
                        page={page}
                        prodLoading={prodLoading}
                        setCursor={setCursor}
                        setPage={setPage}
                        setProductPerPage={setProductPerPage}
                      />
                    )}
                  </Box>
                ) : (
                  <Stack
                    spacing={1}
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Typography variant="subtitle1" textAlign={"center"}>
                      This catalog is not synced with app yet!
                    </Typography>
                    <Button variant="outlined" onClick={() => setOnSync(true)}>
                      Sync
                    </Button>
                  </Stack>
                ))}
            </Collapse>
            <Collapse in={onSync}>
              <CatalogSync
                catalogId={catalogId}
                session={session}
                shopifyCatalog={shopifyCatalog}
                mongoCatalogmutate={mongoCatalogmutate}
                onSync={onSync}
                setOnSync={setOnSync}
              />
            </Collapse>
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
