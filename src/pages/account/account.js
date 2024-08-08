import { useState } from "react";
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
import { useRouter } from "next/router";
import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";

import { useSession } from "next-auth/react";
import { GetSingleCompaniesSwr } from "src/service/use-mongo";

const Account = () => {
  const { data: userData } = useSession();
  const toastUp = useToast();

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
              <Typography variant="h4">Account Details</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}>
                <Stack spacing={3}>
                  <AccountProfile userData={userData.user} />
                  </Stack>
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                  <Stack spacing={3}>
                    <SettingsNotifications />
                    <SettingsPassword userData={userData.user}/>
                  </Stack>
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Account;
