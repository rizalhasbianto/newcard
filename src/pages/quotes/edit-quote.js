import { useCallback, useRef, useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Slide,
  Unstable_Grid2 as Grid
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { QuotesForm } from 'src/sections/quotes/quote-form';
import { getQuotesData } from 'src/service/use-mongo'
import { addNewQuoteToMongoDb, deleteQuoteFromMongo } from 'src/service/use-mongo'

const Page = () => {
  const [quotesData, setQuotesData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tabContent, setTabContent] = useState();
  const slideRef = useRef(null);

  const handleChange = useCallback((event, newValue) => {
    setLoading(true)
    setTimeout(() => {
      setTabIndex(newValue);
      setTabContent(quotesData[newValue])
      setLoading(false)
    }, 500);
  }, [quotesData]
  );

  const reqQuotesData = async (page, rowsPerPage) => {
    const query = ({ $or: [{ status: "draft" }, { status: "new" }] })
    const sort = "DSC"
    const resQuotes = await getQuotesData(page, rowsPerPage, query, sort)
    if (!resQuotes) {
      console.log("error get quotes data!")
      return
    }
    setQuotesData(resQuotes.data.quote)
    setTabContent(resQuotes.data.quote[0])
    setLoading(false)
  }

  useEffect(() => {
    reqQuotesData(0, 50)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddQuote = useCallback(
    async () => {
      setLoading(true)
      const resCreateQuote = await addNewQuoteToMongoDb()
      if (!resCreateQuote) {
        setLoading(false)
        return
      }
      reqQuotesData(0, 50)
      setTabIndex(0)
    }, []
  )

  const handleDeleteQuote = useCallback(
    async (id) => {
      setLoading(true)
      const deleteRes = await deleteQuoteFromMongo(id)
      if (!deleteRes) {
        setLoading(false)
        return
      }
      setTabIndex(0)
      reqQuotesData(0, 50)
    }, []
  )

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
                <QuotesForm
                  tabContent={tabContent}
                  reqQuotesData={reqQuotesData}
                />
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
