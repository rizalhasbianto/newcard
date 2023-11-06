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
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
