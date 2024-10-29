import Head from "next/head";
import dynamic from 'next/dynamic';
import { useState } from "react";
import { Box, Container, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";


const now = new Date();

function Page() {
  const Canvas = dynamic(() => import('../../components/canvas/blur-animate'), {
    ssr: false,
  });
  return (
    <>
      <Head>
        <title>Overview | Skratch</title>
      </Head>
      <Box>
        <Canvas />
      </Box>
    </>
  );
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
