import { useCallback, useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { GetCatalogSwr } from "src/service/use-mongo";

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

import CatalogInfo from "src/sections/catalog/catalog-info";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const catalogId = router.query?.catalogId;

  const { data: catalog, isLoading, isError, mutate } = GetCatalogSwr({
    page: 0,
    postPerPage: 1,
    query: { id: catalogId },
  });
console.log("catalog", catalog)
  return (
    <>
      <Head>
        <title>Catalog | Skratch</title>
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
            {catalog &&
            <CatalogInfo session={session} catalog={catalog.data[0]}/>
            }
            
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
