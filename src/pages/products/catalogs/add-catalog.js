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

import CatalogType from "src/sections/catalog/catalog-type"

const Page = () => {
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
                <CatalogType />
            </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
