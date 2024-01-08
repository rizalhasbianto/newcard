import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Tab,
  Card,
  CardContent,
  Divider,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { GetSingleOrderSwr } from "src/service/use-shopify";
import { useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";
import { ImageComponent } from "src/components/image";

const Page = () => {
  const [value, setValue] = useState("1");
  const toastUp = useToast();
  const router = useRouter();
  const { data, isLoading, isError, mutate, isValidating } = GetSingleOrderSwr(router.query.order);
  console.log("data", data);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const Subtotal = () => {
    return 10;
  };

  return (
    <>
      <Head>
        <title>Order | Skratch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Toast
            toastStatus={toastUp.toastStatus}
            handleStatus={toastUp.handleStatus}
            toastMessage={toastUp.toastMessage}
          />
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Order Details</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={8}>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      {data && (
                        <Stack direction={"row"} justifyContent={"space-between"}>
                          <Stack direction={"row"}>
                            <Typography variant="subtitle1" color={"neutral.500"} sx={{ mr: 1 }}>
                              id:
                            </Typography>
                            <Typography variant="subtitle1">{data.newData.name}</Typography>
                          </Stack>
                          <Stack direction={"row"}>
                            <Typography variant="subtitle1" color={"neutral.500"} sx={{ mr: 1 }}>
                              Payment:
                            </Typography>
                            <Typography variant="subtitle1">
                              {data.newData.displayFinancialStatus}
                            </Typography>
                          </Stack>
                          <Stack direction={"row"}>
                            <Typography variant="subtitle1" color={"neutral.500"} sx={{ mr: 1 }}>
                              Fulfillment:
                            </Typography>
                            <Typography variant="subtitle1">
                              {data.newData.displayFulfillmentStatus}
                            </Typography>
                          </Stack>
                        </Stack>
                      )}
                      <Divider sx={{ mt: 2, mb: 2 }} />
                      <Grid container spacing={2}>
                        {data &&
                          data.newData.lineItems.edges.map((item, i) => (
                            <Grid xl={12} key={i + 1}>
                              <Grid container spacing={2}>
                                <Grid xl={2} sx={{position:"relative"}}>
                                  <ImageComponent
                                    img={item.node.image.url}
                                    title={item.node.title}
                                  />
                                </Grid>
                                <Grid xl={6}>
                                  <Typography variant="subtitle1">{item.node.title}</Typography>
                                  <Typography variant="subtitle2" color={"neutral.500"}>
                                    {item.node.variantTitle}
                                  </Typography>
                                  <Typography variant="subtitle2" color={"neutral.500"}>
                                    sku: {item.node.sku}
                                  </Typography>
                                </Grid>
                                <Grid xl={2}>
                                  <Typography variant="subtitle2">
                                    ${item.node.originalUnitPriceSet.shopMoney.amount} X{" "}
                                    {item.node.quantity}
                                  </Typography>
                                </Grid>
                                <Grid xl={2}>
                                  <Typography variant="subtitle2" textAlign={"right"}>
                                    ${item.node.originalTotalSet.shopMoney.amount}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          ))}
                      </Grid>
                    </CardContent>
                  </Card>
                  {data && (
                    <Card>
                      <CardContent>
                        <Grid container spacing={1}>
                        
                          <Grid xl={12}>
                            <Grid container spacing={1}>
                              <Grid xl={4}>
                                <Typography variant="subtitle2" color={"neutral.500"}>
                                  Subtotal
                                </Typography>
                              </Grid>
                              <Grid xl={4}>
                                <Typography variant="subtitle2" color={"neutral.500"}>
                                  {`${data.newData.currentSubtotalLineItemsQuantity} Item's`}
                                </Typography>
                              </Grid>
                              <Grid xl={4} textAlign={"right"}>
                                <Typography variant="subtitle2">${data.newData.currentTotalPriceSet.shopMoney.amount}</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid xl={12}>
                            <Grid container spacing={1}>
                              <Grid xl={4}>
                                <Typography variant="subtitle2" color={"neutral.500"}>
                                  Shipping
                                </Typography>
                              </Grid>
                              <Grid xl={4}>
                                <Typography variant="subtitle2" color={"neutral.500"}>
                                  {data.newData.shippingLine?.title}
                                </Typography>
                              </Grid>
                              <Grid xl={4}>
                                <Typography variant="subtitle2" textAlign={"right"}>
                                  ${data.newData.shippingLine?.originalPriceSet.shopMoney.amount}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid xl={12}>
                            <Grid container spacing={1}>
                              <Grid xl={4}>
                                <Typography variant="subtitle2" color={"neutral.500"}>
                                  Tax
                                </Typography>
                              </Grid>
                              <Grid xl={4}>
                              </Grid>
                              <Grid xl={4}>
                                <Typography variant="subtitle2" textAlign={"right"}>
                                  ${data.newData.currentTotalTaxSet.shopMoney.amount}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid xl={12}>
                          <Divider />
                            <Grid container spacing={1}>
                              <Grid xl={4}>
                                <Typography variant="subtitle2">
                                  Total
                                </Typography>
                              </Grid>
                              <Grid xl={4}>
                              </Grid>
                              <Grid xl={4}>
                                <Typography variant="subtitle2" textAlign={"right"}>
                                ${data.newData.currentTotalPriceSet.shopMoney.amount}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid xl={12}>
                          <Stack direction={"row"}>
                            <Typography variant="subtitle1" color={"neutral.500"} sx={{ mr: 1 }}>
                              Payment Terms:
                            </Typography>
                            <Typography variant="subtitle1">
                              {data.newData.paymentTerms?.paymentTermsName}
                            </Typography>
                          </Stack>
                          <Stack direction={"row"}>
                            <Typography variant="subtitle1" color={"neutral.500"} sx={{ mr: 1 }}>
                              Due In days:
                            </Typography>
                            <Typography variant="subtitle1">
                              {data.newData.paymentTerms?.dueInDays}
                            </Typography>
                          </Stack>
                          <Stack direction={"row"}>
                            <Typography variant="subtitle1" color={"neutral.500"} sx={{ mr: 1 }}>
                              Payment Gateway:
                            </Typography>
                            <Typography variant="subtitle1">
                              {data.newData.paymentGatewayNames[0]} 
                            </Typography>
                          </Stack>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
                <Grid xs={12} md={6} lg={4}>
                  {data && (
                    <Card>
                      <CardContent>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h6" sx={{ textTransform: "uppercase" }}>
                            {data.newData.shippingAddress?.company}
                          </Typography>
                          <Typography variant="subtitle1">
                            {data.newData.shippingAddress?.name}
                          </Typography>
                          <Typography variant="body2">
                            {data.newData.customer?.email}
                          </Typography>
                        </Box>
                        <Divider sx={{ mt: 2, mb: 2 }} />
                        <Box sx={{mb:2}}>
                          <Typography variant="subtitle1">Shipping:</Typography>
                          <Typography variant="body2">
                            {data.newData.shippingAddress?.address1}
                          </Typography>
                          <Typography variant="body2">
                            {data.newData.shippingAddress?.city}{" "}
                            {data.newData.shippingAddress?.province}{" "}
                            {data.newData.shippingAddress?.zip}
                          </Typography>
                          <Typography variant="body2">
                            {data.newData.shippingAddress?.country}
                          </Typography>
                          <Typography variant="body2">
                            {data.newData.shippingAddress?.phone &&
                              `Phone:${data.newData.shippingAddress?.phone}`}
                          </Typography>
                        </Box>
                        {
                          data.newData.billingAddressMatchesShippingAddress ?
                          <Box>
                            <Typography variant="subtitle1">Billing: Same as shipping</Typography>
                          </Box>
                          :
                          <Box>
                          <Typography variant="subtitle1">Shipping:</Typography>
                          <Typography variant="body2">
                            {data.newData.billingAddress?.address1}
                          </Typography>
                          <Typography variant="body2">
                            {data.newData.billingAddress?.city}{" "}
                            {data.newData.billingAddress?.province}{" "}
                            {data.newData.billingAddress?.zip}
                          </Typography>
                          <Typography variant="body2">
                            {data.newData.billingAddress?.country}
                          </Typography>
                          <Typography variant="body2">
                            {data.newData.billingAddress?.phone &&
                              `Phone:${data.newData.shippingAddress?.phone}`}
                          </Typography>
                        </Box>
                        }
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
