import { useCallback, useState, useMemo } from 'react';
import { ClientRequest } from 'src/lib/ClientRequest'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Alert,
  Stack,
  Slide,
  Unstable_Grid2 as Grid
} from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

import { SearchProduct } from './quotes-search-product'
import QuoteSelectCompany from './quote-select-company'
import LineItemQuotes from './quotes-selected-products'

export const QuotesForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [shipTo, setShipTo] = useState("");
  const [shipToList, setShipToList] = useState([]);
  const [location, setLocation] = useState("");
  const [quotesList, setQuotesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null)
  const [toastStatus, setToastStatus] = useState(false);

  const saveToMongoDb = useCallback(async () => {
    const countSubtotal = quotesList.reduce((n, { total }) => n + total, 0)
    const tax = (countSubtotal * 0.1).toFixed(2)
    const total = Number(countSubtotal) + Number(tax)
    const today = new Date()
    const mongoRes = await ClientRequest(
      "/api/quotes/create-quote",
      "POST",
      {
        company: {
          name: companyName,
          shipTo: shipTo
        },
        quotesList: quotesList,
        quoteInfo: {
          total: total,
          item: quotesList.length
        },
        status: "open",
        createdAt: today,
        updatedAt: ""
      }
    )
    return mongoRes
  }, [companyName, quotesList, shipTo])

  const syncToShopify = useCallback(
    async (mongoReponse) => {
      const lineItems = quotesList.map((list) => {
        return (
          `{
          variantId: "${list.variant.id}",
          quantity: ${list.qty}
        }`
        )
      })
      const sendToShopify = await ClientRequest(
        "/api/shopify/draft-order-create",
        "POST", {
        lineItems,
        poNumber: mongoReponse?.data.insertedId
      })
      return sendToShopify
    }, [quotesList])

  const handleSubmit = useCallback(
    async () => {
      setLoading(true)

      // Create new quote at mongo 
      const mongoReponse = await saveToMongoDb()
      if (!mongoReponse) {
        setToastStatus(true)
        setToastMessage("Error save to DB!")
        setLoading(false)
        return
      }
      console.log("should be stop")
      // Create draft order at shopify
      const shopifyResponse = await syncToShopify(mongoReponse)
      if (!shopifyResponse || shopifyResponse.createDraft.errors) {
        setToastStatus(true)
        setToastMessage("Error sync to Shopify! saved as Draft")
        setLoading(false)
        return
      }
      setLoading(false)
    },
    [saveToMongoDb, syncToShopify]
  );

  return (
    <form
      autoComplete="off"
      noValidate
    >
      <Stack
        variant={"alert"}
        spacing={2}
        onClick={() => setToastStatus(false)}
      >
        <Slide
          direction="left"
          in={toastStatus}
          mountOnEnter
          unmountOnExit
        >
          <Alert
            severity="error"
            variant="filled"
          >
            {toastMessage}
          </Alert>
        </Slide>
      </Stack>
      <Card sx={{ mb: 2 }}>
        <CardHeader
          subheader="Please choose a company"
          title="Company Options"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <QuoteSelectCompany
              location={location}
              shipToList={shipToList}
              shipTo={shipTo}
              companyName={companyName}
              setShipToList={setShipToList}
              setLocation={setLocation}
              setShipTo={setShipTo}
              setCompanyName={setCompanyName}
            />
          </Box>
        </CardContent>
      </Card>
      {companyName &&
        <Card sx={{ mb: 2 }}>
          <CardHeader
            subheader="The information can be edited"
            title="Add quotes Item"
          />
          <CardContent sx={{ pt: 0, pb: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <SearchProduct
                quotesList={quotesList}
                setQuotesList={setQuotesList}
              />
            </Box>
          </CardContent>
        </Card>
      }
      {companyName && quotesList.length > 0 &&
        <Card>
          <CardHeader
            subheader="The information can be edited"
            title="Selected Products"
          />
          <CardContent sx={{ pt: 0 }}>
            <LineItemQuotes
              quotesList={quotesList}
              setQuotesList={setQuotesList}
            />
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <LoadingButton
              color="primary"
              onClick={() => handleSubmit("template")}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Save As Template
            </LoadingButton>
            <LoadingButton
              color="primary"
              onClick={() => handleSubmit("draft")}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Save As Draft
            </LoadingButton>
            <LoadingButton
              color="primary"
              onClick={() => handleSubmit("publish")}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Publish
            </LoadingButton>
            <LoadingButton
              color="primary"
              onClick={() => handleSubmit("invoice")}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Send Invoice
            </LoadingButton>
          </CardActions>
        </Card>
      }
    </form>
  );
};
