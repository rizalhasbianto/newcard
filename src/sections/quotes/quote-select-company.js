import { useCallback, useState } from "react";
import {
  TextField,
  MenuItem,
  ListItemText,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";

export default function QuoteSelectCompany(props) {
  const {
    companies,
    shipToList,
    shipTo,
    setShipToList,
    setShipTo,
    selectedCompany,
    setSelectedCompany,
    handleSubmit
  } = props;

  const selectedContact = selectedCompany?.contact.find((contact) => contact.default)
  const handleChange = useCallback(
    (event, data) => {
      let selectedCompany
      let selectedShipping
      if (event.target.name === "companyName") {
        if (!event.target.value) {
          setShipToList([]);
          setShipTo("");
          setSelectedCompany();
          return;
        }
        selectedCompany = companies.find((company) => company.name === event.target.value);
        selectedShipping = selectedCompany.shipTo.find((ship) => ship.default)
        setShipTo(selectedShipping);
        setShipToList(selectedCompany.shipTo);
        setSelectedCompany(selectedCompany)
      } else {
        selectedShipping = data.find((ship) => ship.locationName === event.target.value);
        setShipTo(selectedShipping);
      }
      handleSubmit({company:selectedCompany, shipToAddress: selectedShipping})
    },
    [companies, handleSubmit, setSelectedCompany, setShipTo, setShipToList]
  );

  return (
    <>
      <Grid container spacing={1}>
        <Grid xs={12} md={6}>
          <TextField
            id="companyName"
            name="companyName"
            label="Company"
            variant="outlined"
            value={selectedCompany?.name ?? ""}
            select
            fullWidth
            required
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {companies.map((option) => (
              <MenuItem key={option.name} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            label="Ship To"
            name="shipTo"
            variant="outlined"
            onChange={(e) => handleChange(e, shipToList)}
            required
            select
            value={shipTo?.locationName ?? ""}
            defaultValue={shipTo?.locationName ?? ""}
          >
            {!selectedCompany && (
              <MenuItem value="">
                <em>Please select company first</em>
              </MenuItem>
            )}
            {shipToList.map((option, idx) => (
              <MenuItem key={idx+1} value={option.locationName}>
                {option.locationName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid xs={12} md={6}>
          {selectedCompany && (
            <Grid container spacing={1}>
              <Grid xs={12} md={6}>
                <ListItemText primary="Email" secondary={selectedContact?.detail.email} />
              </Grid>
              <Grid xs={12} md={6}>
                <ListItemText primary="Name" secondary={selectedContact?.detail.name} />
              </Grid>
            </Grid>
          )}
        </Grid>
        {shipTo && (
          <Grid container spacing={3}>
            <Grid xs={12} md={12}>
              <ListItemText
                primary="Shipping Address"
                secondary={
                  <>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {shipTo?.location.address + " "}
                    </Typography>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {shipTo.location.city} {shipTo.location.state}, {shipTo.location.zip + " "}
                    </Typography>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      United States
                    </Typography>
                  </>
                }
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
}
