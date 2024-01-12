import { useCallback, useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { utcToZonedTime } from "date-fns-tz";
import { GetQuotesData, AddNewQuoteToMongoDb, DeleteQuoteFromMongo } from "src/service/use-mongo";

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
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import QuotesForm from "src/sections/quotes/quote-form";
import CardLoading from "src/components/grid-loading";


const Page = () => {
  const [quotesData, setQuotesData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDataLoading, setDataLoading] = useState(false);
  const [tabContent, setTabContent] = useState();
  const [offset, setOffset] = useState(0);
  const { data: session } = useSession();
  const slideRef = useRef(null);

  const handleChange = useCallback(
    (event, newValue) => {
      setLoading(true);
      setTimeout(() => {
        setTabIndex(newValue);
        setTabContent(quotesData[newValue]);
        setLoading(false);
      }, 300);
    },
    [quotesData]
  );

  const reqQuotesData = async (page, rowsPerPage, tabIdx) => {
    const quoteQuery = {
      $or: [{ status: "draft" }, { status: "new" }],
      "createdBy.name": session.user.detail.name,
      }
    const sort = "DSC";
    const resQuotes = await GetQuotesData(page, rowsPerPage, quoteQuery, sort);

    if (!resQuotes) {
      console.log("error get quotes data!");
      setDataLoading(false);
      setLoading(false);
      return;
    }

    setQuotesData(resQuotes.data.quote);
    setTabContent(resQuotes.data.quote[tabIdx ? tabIdx : 0]);
    setTabIndex(tabIdx ? tabIdx : 0);
    setDataLoading(false);
    setLoading(false);
  };

  useEffect(() => {
    setDataLoading(true);
    reqQuotesData(0, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddQuote = useCallback(async () => {
    setLoading(true);
    const resCreateQuote = await AddNewQuoteToMongoDb({
      createdBy:{
        name: session.user.detail.name,
        role: session.user.detail.role,
        company: session.user.detail.company.companyName
      },
      createdAt:utcToZonedTime(new Date(), "America/Los_Angeles")
    });
    if (!resCreateQuote) {
      setLoading(false);
      return;
    }
    reqQuotesData(0, 50);
  }, []);

  const handleDeleteQuote = useCallback(async (id) => {
    setLoading(true);
    const deleteRes = await DeleteQuoteFromMongo(id);
    if (!deleteRes) {
      setLoading(false);
      return;
    }
    reqQuotesData(0, 50);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const onScroll = () => setOffset(window.scrollY);
      window.removeEventListener("scroll", onScroll);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Add new quote | Skratch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          {isDataLoading ? (
            <CardLoading count={1} />
          ) : (
            <Box>
              {quotesData.length === 0 ? (
                <Stack
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Typography variant="subtitle1">Start new quote</Typography>
                  <LoadingButton
                    color="primary"
                    onClick={handleAddQuote}
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<AddIcon />}
                    variant="outlined"
                  >
                    Add
                  </LoadingButton>
                </Stack>
              ) : (
                <Stack spacing={3} ref={slideRef}>
                  <Stack
                    spacing={1}
                    direction={"row"}
                    sx={{
                      position: "sticky",
                      top: "0px",
                      zIndex: "3",
                    }}
                    className={offset > 100 ? "onScroll" : ""}
                  >
                    <LoadingButton
                      color="primary"
                      onClick={handleAddQuote}
                      loading={loading}
                      loadingPosition="start"
                      startIcon={<AddIcon />}
                      variant="outlined"
                    >
                      Add
                    </LoadingButton>
                    <Tabs
                      value={tabIndex}
                      onChange={handleChange}
                      variant="scrollable"
                      scrollButtons
                      allowScrollButtonsMobile
                      aria-label="scrollable force tabs example"
                      direction="left"
                    >
                      {quotesData.map((quote, i) => {
                        return (
                          <Tab
                            label={
                              <Grid container alignItems="center" spacing={2}>
                                <Grid md={3}>
                                  {tabIndex === i ? (
                                    <DeleteIcon onClick={() => handleDeleteQuote(quote._id)} />
                                  ) : (
                                    <DeleteIcon sx={{ opacity: 0.3 }} />
                                  )}
                                </Grid>
                                <Grid md={9}>
                                  <Typography variant="subtitle1">
                                    {quote.company.name || "New Quote"}
                                  </Typography>
                                  {
                                    offset < 70 &&
                                    <Typography variant="subtitle1">
                                    #{quote._id.slice(-4)}
                                  </Typography>
                                  }
                                </Grid>
                              </Grid>
                            }
                            iconPosition="start"
                            key={i + 1}
                            sx={{ mr: 2 }}
                          />
                        );
                      })}
                    </Tabs>
                  </Stack>
                  <Stack>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={12} lg={12}>
                      {tabContent && (
                        <QuotesForm
                          tabContent={tabContent}
                          reqQuotesData={reqQuotesData}
                          tabIndex={tabIndex}
                          session={session}
                        />
                      )}
                    </Grid>
                  </Grid>
                  </Stack>
                </Stack>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
