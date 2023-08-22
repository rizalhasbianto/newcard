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

import { companySample } from 'src/data/company'
import { SearchProduct } from './quotes-search-product'
import StickyHeadTable from './quotes-selected-products'

export const QuotesForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [shipTo, setShipTo] = useState("");
  const [shipToList, setShipToList] = useState([]);
  const [location, setLocation] = useState("");
  const [quotesList, setQuotesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (event, data) => {
      if (event.target.name === "companyName") {
        setCompanyName(event.target.value)
        if (!event.target.value) {
          setShipToList([])
          setShipTo("")
          setLocation("")
          return
        }
        const shipToList = companySample.find((company) => company.name === event.target.value)
        setShipTo(shipToList.shipTo[0].locationName)
        setShipToList(shipToList.shipTo)
        setLocation(shipToList.shipTo[0].location)
      } else {
        const locationList = data.find((ship) => ship.locationName === event.target.value)
        setShipTo(event.target.value)
        setLocation(locationList.location)
      }

    },
    []
  );

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
          company : {
            name: companyName,
            shipTo: shipTo
          },
          quotesList: quotesList,
          quoteInfo : {
            total: total,
            item: quotesList.length
          },
          status: "open"
        }
      )

      if(!mongoRes) return

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
        "POST", {lineItems})
      if(!sendToShopify || sendToShopify.createDraft.errors) {
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
      <Card>
        <CardHeader
          subheader="Please choose a company"
          title="Company Options"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={1}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  id="companyName"
                  name="companyName"
                  label="Company"
                  value={companyName}
                  select
                  fullWidth
                  required
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {companySample.map((option) => (
                    <MenuItem
                      key={option.name}
                      value={option.name}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Ship To"
                  name="shipTo"
                  onChange={(e) => handleChange(e, shipToList)}
                  required
                  select
                  value={shipTo ?? " "}
                  defaultValue={shipTo ?? ""}
                >
                  {!companyName &&
                    <MenuItem value="">
                      <em>Please select company first</em>
                    </MenuItem>
                  }
                  {shipToList.map((option) => (
                    <MenuItem
                      key={option.locationName}
                      value={option.locationName}
                    >
                      {option.locationName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
          {
            location &&
            <Box sx={{ m: -1.5 }}>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={6}
                >
                  <ListItemText
                    primary="Shipping"
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {location.address}
                        </Typography>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {location.city} {location.state}, {location.zip}
                        </Typography>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          United States
                        </Typography>
                      </>
                    } />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  <ListItemText
                    primary="Billing"
                    secondary="Jan 9, 2014"
                  />
                </Grid>
              </Grid>
            </Box>
          }
        </CardContent>
      </Card>
      <Card>
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
        <CardHeader
          subheader="The information can be edited"
          title="Selected Products"
        />
        <CardContent sx={{ pt: 0 }}>
          <StickyHeadTable quotesList={quotesList}/>
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
            Save details
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
};
