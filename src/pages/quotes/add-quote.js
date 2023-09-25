import { useCallback, useRef, useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  Slide,
  Unstable_Grid2 as Grid
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { QuotesForm } from 'src/sections/quotes/quote-form';
import { GetQuotesData } from 'src/service/use-mongo'
import { AddNewQuoteToMongoDb, DeleteQuoteFromMongo } from 'src/service/use-mongo'

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
    console.log("string", JSON.stringify(({ $or: [{ status: "draft" }, { status: "new" }] })))
    const sort = "DSC"
    const resQuotes = await GetQuotesData(page, rowsPerPage, query, sort)
    if (!resQuotes) {
      console.log("error get quotes data!")
      setLoading(false)
      return
    }
    setQuotesData(resQuotes.data.quote)
    setTabContent(resQuotes.data.quote[0])
    setTabIndex(0)
    setLoading(false)
  }

  useEffect(() => {
    reqQuotesData(0, 50)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddQuote = useCallback(
    async () => {
      setLoading(true)
      const resCreateQuote = await AddNewQuoteToMongoDb()
      if (!resCreateQuote) {
        setLoading(false)
        return
      }
      reqQuotesData(0, 50)
    }, []
  )

  const handleDeleteQuote = useCallback(
    async (id) => {
      setLoading(true)
      const deleteRes = await DeleteQuoteFromMongo(id)
      if (!deleteRes) {
        setLoading(false)
        return
      }
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
          {quotesData.length === 0 ?
            (
              <Stack
                spacing={1}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Typography variant='subtitle1'>
                  Start new quote
                </Typography>
                <LoadingButton
                  color="primary"
                  onClick={handleAddQuote}
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<AddIcon />}
                  variant="outlined"
                >Add</LoadingButton>
              </Stack>
            ) : (
              <Stack
                spacing={3}
                ref={slideRef}
                sx={{
                  overflow: "hidden"
                }}
              >
                <Stack
                  spacing={1}
                  direction={"row"}
                >
                  <LoadingButton
                    color="primary"
                    onClick={handleAddQuote}
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<AddIcon />}
                    variant="outlined"
                  >Add</LoadingButton>
                  <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                    direction="left"
                  >
                    {
                      quotesData.map((quote, i) => {
                        return (
                          <Tab
                            label={
                              <Grid
                                container
                                alignItems="center"
                                spacing={2}
                              >
                                <Grid md={3}>
                                  {tabIndex === i ? (
                                    <DeleteIcon onClick={() => handleDeleteQuote(quote._id)} />
                                  ) : (
                                    <DeleteIcon sx={{ opacity: 0 }} />
                                  )}

                                </Grid>
                                <Grid md={9}>
                                  <Typography variant='subtitle1'>
                                    {quote.company.name || "New Quote"}
                                  </Typography>
                                  <Typography variant='subtitle1'>
                                    #{quote._id.slice(-4)}
                                  </Typography>
                                </Grid>

                              </Grid>
                            }
                            iconPosition="start"
                            key={i + 1}
                          />
                        )
                      })
                    }

                  </Tabs>
                </Stack>
                <Slide
                  in={!loading ? true : false}
                  direction="right"
                  container={slideRef.current}
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
                </Slide>
              </Stack>
            )
          }
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
