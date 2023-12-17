import { useCallback, useRef, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import {
  Box,
  Container,
  Stack,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { QuotesForm } from 'src/sections/quotes/quote-form';
import { GetQuotesData } from 'src/service/use-mongo'
import CardLoading from "src/components/grid-loading";

const Page = () => {
  const [isLoading, setLoading] = useState(false);
  const [tabContent, setTabContent] = useState();
  const slideRef = useRef(null);
  const router = useRouter();
  const { quoteId } = router.query;
  const { data: session } = useSession();

  const reqQuotesData = async () => {
    setLoading(true)
    const page = 0
    const rowsPerPage = 1
    const query = ({ quoteId: quoteId })
    const sort = "DSC"
    const type = "id"
    
    const resQuotes = await GetQuotesData(page, rowsPerPage, query, sort, type)
    if (!resQuotes) {
      console.log("error get quotes data!")
      setLoading(false)
      return
    }

    setTabContent(resQuotes.data.quote[0])
    setLoading(false)
  }

  useEffect(() => {
    if (quoteId) {
      reqQuotesData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId]);

  return (
    <>
      <Head>
        <title>
          Edit quote | Skratch
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack
            spacing={3}
            ref={slideRef}
            sx={{
              overflow: "hidden"
            }}
          >
            {isLoading && <CardLoading count={1} />}
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={12}
                lg={12}
              >
                {
                  tabContent &&
                  <QuotesForm
                    tabContent={tabContent}
                    reqQuotesData={reqQuotesData}
                    session={session}
                  />
                }
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
