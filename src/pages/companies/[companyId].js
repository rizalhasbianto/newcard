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
import { CompanyProfile } from "src/sections/companies/company-profile";
import { CompanyProfileDetails } from "src/sections/companies/tab/company-profile-details";
import { CompanyAddresses } from "src/sections/companies/tab/company-addresses";
import { GetSingleCompaniesSwr, GetCompanies } from "src/service/use-mongo";
import { useState } from "react";
import { CompanyEditDetails } from "src/sections/companies/tab/company-profile-edit";
import { useRouter } from 'next/router';
import { useToast } from 'src/hooks/use-toast'
import Toast from 'src/components/toast'

const Page = () => {
  const [value, setValue] = useState("1");
  const toastUp = useToast();
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, isError } = GetSingleCompaniesSwr(router.query.companyId, 0, 1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>Company | Devias Kit</title>
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
                  <CompanyProfile />
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
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
