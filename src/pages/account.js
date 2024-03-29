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
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CompanyProfile from "src/sections/companies/company-profile";
import CompanyShipping from "src/sections/companies/tab/company-shipping";
import { useState } from "react";
import CompanyDetails from "src/sections/companies/tab/company-details";
import CompanyQuote from "src/sections/companies/tab/company-quote";
import { useRouter } from 'next/router';
import { useToast } from 'src/hooks/use-toast'
import Toast from 'src/components/toast'

import { useSession } from "next-auth/react"
import { GetSingleCompaniesSwr } from "src/service/use-mongo";

const Page = () => {
  const { data: userData } = useSession()
  const [value, setValue] = useState("1");
  const toastUp = useToast();
  const { data, isLoading, isError, mutate, isValidating } = GetSingleCompaniesSwr({id:userData?.user?.detail?.company?.companyId, page:0, postPerPage:1});
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
    <Head>
      <title>Account | Skratch</title>
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
              <Grid xs={12} md={6} lg={4}>
                {data && <CompanyProfile company={data && data.data.company[0]} toastUp={toastUp} />}
              </Grid>
              <Grid xs={12} md={6} lg={8}>
                <Card>
                  <CardContent>
                    <TabContext value={value}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                          <Tab label="Profile" value="1" />
                          <Tab label="Addresses" value="2" />
                          <Tab label="Quote" value="3" />
                        </TabList>
                      </Box>
                      <TabPanel value="1">
                        { data && <CompanyDetails data={data && data.data.company[0]} toastUp={toastUp} /> }
                      </TabPanel>
                      <TabPanel value="2">
                      { data && <CompanyShipping data={data && data.data.company[0]} toastUp={toastUp} mutate={mutate}/> }
                      </TabPanel>
                      <TabPanel value="3">
                        <CompanyQuote items={data && data.data.relatedQuote}/>
                      </TabPanel>
                    </TabContext>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
)};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
