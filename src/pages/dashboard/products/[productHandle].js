import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GetProductByhandleSwr, GetSingleInventorySwr } from "src/service/use-shopify";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Toast from "src/components/toast";
import { useToast } from "src/hooks/use-toast";

import { Box, Card, CardContent, Container, Stack, Unstable_Grid2 as Grid } from "@mui/material";

import { ProductImage } from "src/sections/singleProduct/product-image";
import { ProductInfo } from "src/sections/singleProduct/product-info";
import { ProductFrom } from "src/sections/singleProduct/product-form";
import { ProductInventory } from "src/sections/singleProduct/product-inventory";

const Page = () => {
  const router = useRouter();
  const toastUp = useToast();
  const { data: session } = useSession();
  const { quoteId, inventory, productHandle } = router.query;

  const { data, isLoading, isError } = GetProductByhandleSwr(productHandle);
  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
    isError: isErrorInventory,
  } = GetSingleInventorySwr({ handle: router.query.productHandle, inventory: inventory });

  const [selectedImgVariant, setSelectedImgVariant] = useState();
  const [selectedTab, setSelectedTab] = useState(1);
  const imgGallery = data?.newData.images.edges;
  const productData = data?.newData;

  return (
    <>
      <Head>
        <title>Products | Skratch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Toast
            toastStatus={toastUp.toastStatus}
            handleStatus={toastUp.handleStatus}
            toastMessage={toastUp.toastMessage}
          />
          <Stack spacing={3}>
            <Card>
              {data && (
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid md={6}>
                      <ProductImage
                        imgGallery={imgGallery}
                        selectedImgVariant={selectedImgVariant}
                        setSelectedImgVariant={setSelectedImgVariant}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                      />
                    </Grid>
                    <Grid md={6}>
                      <ProductInfo productData={productData} inventory={inventory} />
                      {inventory && inventoryData ? (
                        <ProductInventory inventoryData={inventoryData} />
                      ) :  (
                        <ProductFrom
                          selectedProduct={productData}
                          setSelectedImgVariant={setSelectedImgVariant}
                          setSelectedTab={setSelectedTab}
                          quoteId={quoteId}
                          toastUp={toastUp}
                          session={session}
                        />
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              )}
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
