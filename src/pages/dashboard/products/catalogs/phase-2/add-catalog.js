import { useCallback, useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { utcToZonedTime } from "date-fns-tz";
import {
  Box,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  Slide,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

import CatalogType from "src/sections/catalog/phase-2/catalog-type"

const Page = () => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Add new catalog | Skratch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
            <Box>
                <CatalogType session={session}/>
            </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
