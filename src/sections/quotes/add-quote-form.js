import { useCallback, useState, useMemo } from 'react';
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

import { companySample } from 'src/data/company'
import { SearchProduct } from './search-product'

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  },
  {
    value: 'los-angeles',
    label: 'Los Angeles'
  }
];

export const QuotesForm = () => {
  const [values, setValues] = useState({
    companyName: '',
    shipTo: '',
    lineItem: [
      {
        variantId: "324234324",
        qty: "5"
      },
      {
        variantId: "324234324",
        qty: "5"
      },
    ],
    quoteInfo: {
      totalPrice: "5000",
      totalItem: "7",
      cat: "custom"
    },
    status: "open"
  });

  const [companyName, setCompanyName] = useState("")
  const [shipTo, setShipTo] = useState("")
  const [shipToList, setShipToList] = useState([])
  const [location, setLocation] = useState("")

  const handleChange = useCallback(
    (event, data) => {
      if (event.target.name === "companyName") {
        setCompanyName(event.target.value)
        if(!event.target.value) {
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
    (event) => {
      event.preventDefault();
    },
    []
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
              spacing={3}
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
        </CardContent>
        {
          location &&
          <>
          <CardHeader
          subheader="Selected address based on company location"
          title="Selected Address"
        />
        <CardContent sx={{ pt: 0 }}>
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
                secondary= {
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
        </CardContent>
          </>
        }
      </Card>
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <SearchProduct />
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
          >
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
