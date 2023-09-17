import { useCallback, useRef, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Stack,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { QuotesForm } from 'src/sections/quotes/quote-form';
import { getQuotesData } from 'src/service/use-mongo'

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [tabContent, setTabContent] = useState();
  const slideRef = useRef(null);
  const router = useRouter();
  const { quoteId } = router.query;

  const reqQuotesData = async (quoteId) => {
    setLoading(true)
    const page = 0
    const rowsPerPage = 1
    const query = ({ quoteId: quoteId })
    const sort = "DSC"
    const type = "id"
    const resQuotes = await getQuotesData(page, rowsPerPage, query, sort, type)
    if (!resQuotes) {
      console.log("error get quotes data!")
      return
    }
    setTabContent(resQuotes.data.quote[0])
    setLoading(false)
  }

  useEffect(() => {
    if (quoteId) {
      reqQuotesData(quoteId)
    }
  }, [quoteId]);

  return (
    <>
      <Head>
        <title>
          Add new quote | Skratch
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
