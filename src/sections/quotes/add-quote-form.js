import { useCallback, useState, useMemo } from 'react';
import { ClientRequest } from 'src/lib/ClientRequest'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  ListItemText,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

import { SearchProduct } from './quotes-search-product'
import QuoteSelectCompany from './quote-select-company'
import StickyHeadTable from './quotes-selected-products'

export const QuotesForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [shipTo, setShipTo] = useState("");
  const [shipToList, setShipToList] = useState([]);
  const [location, setLocation] = useState("");
  const [quotesList, setQuotesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true)
      const countSubtotal = quotesList.reduce((n, { total }) => n + total, 0)
      const tax = (countSubtotal * 0.1).toFixed(2)
      const total = Number(countSubtotal) + Number(tax)

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
          status: "open"
        }
      )

      if (!mongoRes) {
        console.log("error", mongoRes)
        return
      }

      // Create draft order at shopify
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
        "POST", { lineItems })
      if (!sendToShopify || sendToShopify.createDraft.errors) {
        console.log("error", sendToShopify)
        return
      }
      setLoading(false)
    },
    [quotesList, shipTo, companyName]
  );

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
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
            <StickyHeadTable quotesList={quotesList} />
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>

            <LoadingButton
              color="primary"
              onClick={handleSubmit}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Save As Draft
            </LoadingButton>
            <LoadingButton
              color="primary"
              onClick={handleSubmit}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Publish
            </LoadingButton>
            <LoadingButton
              color="primary"
              onClick={handleSubmit}
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
