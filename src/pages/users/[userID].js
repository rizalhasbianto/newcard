import { useState, useEffect } from "react";
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
import { AccountProfile } from "src/sections/account/account-profile";
import { CompanyProfile } from "src/sections/account/company-profile";
import { SettingsNotifications } from "src/sections/account/settings-notifications";
import { SettingsPassword } from "src/sections/account/settings-password";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";
import { useRouter } from "next/router";
import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";

import { useSession } from "next-auth/react";
import { GetSingleUserSwr } from "src/service/use-mongo";

const Page = () => {
  const [userDataDetail, setUserDataDetail] = useState();
  const toastUp = useToast();
  const router = useRouter();

  const { data:userData, isLoading, isError, mutate } = GetSingleUserSwr({
    userID: router.query?.userID,
    runFetch: router.query?.userID ? true : false,
  });

  useEffect(() => {
    if (!userData) return;

    setUserDataDetail({
      email:userData.data[0].email,
      name:userData.data[0].name,
      detail: userData.data[0]
    });
  }, [userData]);

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
              <Typography variant="h4">User Edit</Typography>
            </div>
            {userDataDetail && (
              <div>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6} lg={4}>
                    <Stack spacing={3}>
                      <AccountProfile userData={userDataDetail} />
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6} lg={8}>
                    <Stack spacing={3}>
                      <AccountProfileDetails userData={userDataDetail} toastUp={toastUp} mutate={mutate}/>
                      <SettingsNotifications />
                      <SettingsPassword userData={userDataDetail} />
                    </Stack>
                  </Grid>
                </Grid>
              </div>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
