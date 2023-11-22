import { useRouter } from "next/router";
import { GetProductByhandleSwr } from "src/service/use-shopify";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ImageComponent } from "src/components/image";

import {
  Box,
  Card,
  CardContent,
  Button,
  ButtonGroup,
  Container,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  SvgIcon,
  Typography,
  Tab,
  Tabs,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const { data, isLoading, isError } = GetProductByhandleSwr(router.query.productHandle);
  console.log("data", data)
  const imgGallery = data?.newData.images.edges;
  console.log("imgGallery", imgGallery)
  const [selectedImg, setSelectedImg] = useState();
  const [selectedTab, setSelectedTab] = useState(1);
  const handleTabChange = useCallback(
    (event, newValue) => {
      setSelectedTab(newValue);
      setSelectedImg(imgGallery[newValue - 1].node.bigUrl)
    },
    [selectedImg]
  );

  useEffect(
    () => {
      if(data) {
        setSelectedImg(imgGallery[0].node.bigUrl)
      }
    },[data]
  )

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
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid md={6}>
                    <Stack spacing={3}>
                      <Grid container spacing={3}>
                        <Grid md={2}>
                          <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={selectedTab}
                            onChange={handleTabChange}
                            aria-label="Vertical tabs example"
                            sx={{ borderRight: 1, borderColor: "divider", height: "500px" }}
                          >
                            {data &&
                              imgGallery.map((item, i) => (
                                <Tab
                                  value={i + 1}
                                  key={i + 1}
                                  icon={<ImageComponent img={item.node.url} />}
                                  sx={{
                                    height: "100px",
                                    position: "relative",
                                    left: "-10px",
                                    margin: "5px 0"
                                  }}
                                />
                              ))}
                          </Tabs>
                        </Grid>
                        <Grid md={8} sx={{position: "relative"}}>{selectedImg && <ImageComponent img={selectedImg } />}</Grid>
                      </Grid>
                    </Stack>
                  </Grid>
                  <Grid md={6}>
                    <h1>test</h1>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
