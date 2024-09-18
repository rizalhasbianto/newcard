import { useCallback, useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GetCatalogSwr } from "src/service/use-mongo";
import {
  GetProductsPaginate,
  GetShopifyCatalog,
  GetPricelistPrices,
} from "src/service/use-shopify";

import { Box, Container, Stack, Typography, Collapse, Button } from "@mui/material";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CatalogInfo from "src/sections/catalog/catalog-info";
import CatalogSelectedProducts from "src/sections/catalog/catalog-selected-products";
import CatalogProductList from "src/sections/catalog/catalog-products-list";
import CatalogCompany from "src/sections/catalog/catalog-company";
import CatalogSync from "src/sections/catalog/catalog-sync";
import TableLoading from "src/components/table-loading";

import Toast from "src/components/toast";
import { useToast } from "src/hooks/use-toast";

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
  const toastUp = useToast();

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
    if (product && shopifyCatalog) {
      setPageInfo(product.newData.pageInfo);
      gassignPricelistPrices(product, shopifyCatalog);
    }
  }, [product, shopifyCatalog]);

  const gassignPricelistPrices = async (product, shopifyCatalog) => {
    const getPricelistPrices = await GetPricelistPrices(product, shopifyCatalog);
    const globalPrice = shopifyCatalog.newData.data.catalog.priceList.parent;
    product.newData.edges.forEach((item) => {
      const price =
        getPricelistPrices.newData.data[
          `prod_${item.node.id.replace("gid://shopify/Product/", "")}`
        ];
      if (price) {
        const maxPrice = Math.max(...price.prices.edges.map((o) => o.node.price.amount));
        const minPrice = Math.min(...price.prices.edges.map((o) => o.node.price.amount));
        let type = "parent";
        price.prices.edges.forEach((prc) => {
          if (prc.node.originType === "FIXED") {
            type = "fixed";
          }
        });
        item.node.overrideType = type;
        item.node.overridePrice = {
          maxVariantPrice: { amount: parseFloat(maxPrice).toFixed(2) },
          minVariantPrice: { amount: parseFloat(minPrice).toFixed(2) },
        };
      } else {
        if (globalPrice) {
          let maxPrice;
          let minPrice;
          const maxPriceGap =
            item.node.priceRange.maxVariantPrice.amount * (globalPrice.adjustment.value * 0.01);
          const minPriceGap =
            item.node.priceRange.minVariantPrice.amount * (globalPrice.adjustment.value * 0.01);
          if (globalPrice.adjustment.type === "PERCENTAGE_DECREASE") {
            maxPrice = item.node.priceRange.maxVariantPrice.amount - maxPriceGap;
            minPrice = item.node.priceRange.minVariantPrice.amount - minPriceGap;
          } else {
            maxPrice = item.node.priceRange.maxVariantPrice.amount + maxPriceGap;
            minPrice = item.node.priceRange.minVariantPrice.amount + minPriceGap;
          }
          item.node.overrideType = "parent";
          item.node.overridePrice = {
            maxVariantPrice: { amount: parseFloat(maxPrice).toFixed(2) },
            minVariantPrice: { amount: parseFloat(minPrice).toFixed(2) },
          };
        } else {
          item.node.overrideType = "parent";
          item.node.overridePrice = null;
        }
      }
    });
    setProductList(product);
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
        <Toast
            toastStatus={toastUp.toastStatus}
            handleStatus={toastUp.handleStatus}
            toastMessage={toastUp.toastMessage}
          />
        <Container maxWidth="lg">
          {(shopifyCatalogError || mongoError || prodError) && (
            <Typography>Error loading data</Typography>
          )}
          {(shopifyCatalogLoading || mongoLoading) && <TableLoading />}
          <Box>
            <Collapse in={!onSync}>
              {shopifyCatalog &&
                mongoCatalog &&
                (mongoCatalog.data.length > 0 ? (
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
                      toastUp={toastUp}
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
                mongoCatalog={mongoCatalog}
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
