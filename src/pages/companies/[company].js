import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Tab,
  Card,
  CardContent,
  Unstable_Grid2 as Grid,
  Collapse,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CompanyProfile } from "src/sections/companies/company-avatar";
import { CompanyAddresses } from "src/sections/companies/tab/company-shipping";
import { GetSingleCompaniesSwr } from "src/service/use-mongo";
import { useState } from "react";
import { CompanyDetails } from "src/sections/companies/tab/company-details";
import { CompanyDetailsEdit } from "src/sections/companies/tab/company-details-edit";
import { CompanyQuote } from "src/sections/companies/tab/company-quote";
import { useRouter } from "next/router";
import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";

const Page = () => {
  const [value, setValue] = useState("1");
  const [switchEditDetails, setSwitchEditDetails] = useState(true);
  const toastUp = useToast();
  const router = useRouter();
  const { data, isLoading, isError, mutate, isValidating } = GetSingleCompaniesSwr(router.query.company, 0, 1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>Company | Skratch</title>
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
              <Typography variant="h4">Company Details</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={8}>
                  <Card>
                    <CardContent>
                      <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Details" value="1" />
                            <Tab label="Shipping" value="2" />
                            <Tab label="Quote" value="3" />
                          </TabList>
                        </Box>
                        <TabPanel value="1">
                          {data && (
                            <>
                              <Collapse in={switchEditDetails}>
                                <CompanyDetails
                                  data={data && data.data.company[0]}
                                  toastUp={toastUp}
                                  setSwitchEditDetails={setSwitchEditDetails}
                                />
                              </Collapse>
                              <Collapse in={!switchEditDetails}>
                                <CompanyDetailsEdit
                                  data={data && data.data.company[0]}
                                  toastUp={toastUp}
                                  setSwitchEditDetails={setSwitchEditDetails}
                                />
                              </Collapse>
                            </>
                          )}
                        </TabPanel>
                        <TabPanel value="2">
                          {data && (
                            <CompanyAddresses
                              data={data && data.data.company[0]}
                              toastUp={toastUp}
                              mutate={mutate}
                            />
                          )}
                        </TabPanel>
                        <TabPanel value="3">
                          {data && <CompanyQuote items={data && data.data.relatedQuote} />}
                        </TabPanel>
                      </TabContext>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={12} md={6} lg={4}>
                  {data && (
                    <CompanyProfile company={data && data.data.company[0]} toastUp={toastUp} />
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
