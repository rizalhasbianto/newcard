import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetProductByhandleSwr } from "src/service/use-shopify";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Toast from "src/components/toast";
import { useToast } from "src/hooks/use-toast";

import { Box, Card, CardContent, Container, Stack, Unstable_Grid2 as Grid } from "@mui/material";

import { ProductImage } from "src/sections/singleProduct/product-image";
import { ProductInfo } from "src/sections/singleProduct/product-info";
import { ProductFrom } from "src/sections/singleProduct/product-form";

const Page = () => {
  const router = useRouter();
  const toastUp = useToast();

  const { data, isLoading, isError } = GetProductByhandleSwr(router.query.productHandle);
  const quoteId = router.query?.quoteId;
  const [selectedImgVariant, setSelectedImgVariant] = useState();
  const [selectedTab, setSelectedTab] = useState(1);
  const imgGallery = data?.newData.images.edges;
  const productData = data?.newData;

  return (
    <>
      <Head>
        <title>Products | Devias Kit</title>
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
                      <ProductInfo productData={productData} />
                      <ProductFrom
                        selectedProduct={productData}
                        setSelectedImgVariant={setSelectedImgVariant}
                        setSelectedTab={setSelectedTab}
                        quoteId={quoteId}
                        toastUp={toastUp}
                      />
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
