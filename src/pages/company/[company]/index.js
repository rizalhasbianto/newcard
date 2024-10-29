import Head from "next/head";
import { useSession } from "next-auth/react";
import { Box, Container, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as CompanyLayout } from "src/layouts/company/layout";

const now = new Date();
function Page({ domain }) {
  const { data: session } = useSession();
  console.log("session", session)
  return (
    <CompanyLayout>
      <Head>
        <title>Overview | Skratch</title>
      </Head>
      {session && (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <h1>Content for {domain}</h1>
          </Container>
        </Box>
      )}
    </CompanyLayout>
  );
}

export async function getServerSideProps(context) {
  const domain = context.req.headers.host;
  // Pass data to the page via props
  return { props: { domain } };
}

export default Page;
