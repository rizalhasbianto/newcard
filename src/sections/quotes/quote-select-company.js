import { useCallback, useState } from "react";
import {
  TextField,
  MenuItem,
  ListItemText,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { add, formatISO, format } from "date-fns";

import { GetCompanyProductsPrice } from "src/service/use-shopify";
import { paymentOptions } from "src/data/payment-options";

export default function QuoteSelectCompany(props) {
  const {
    companies,
    shipToList,
    shipTo,
    setShipToList,
    setShipTo,
    selectedCompany,
    setSelectedCompany,
    quotesList,
    handleSubmit,
  } = props;

  const selectedContact = selectedCompany?.contacts.find((contact) => contact.default);
  
  const handleChange = useCallback(
    async (event, data) => {
      let selectedCompany;
      let selectedShipping;
      if (event.target.name === "companyName") {
        if (!event.target.value) {
          setShipToList([]);
          setShipTo("");
          setSelectedCompany();
          return;
        }
        selectedCompany = companies.find((company) => company.name === event.target.value);
        selectedShipping = selectedCompany.shipTo.find((ship) => ship.default);
        setShipTo(selectedShipping);
        setShipToList(selectedCompany.shipTo);
        setSelectedCompany(selectedCompany);
        if (quotesList.length > 0) {
          const currentCompanyPrice =
            quotesList[0].variant.companyPrice.node[
              `company_${selectedCompany.shopifyCompanyLocationId}`
            ];
          if (!currentCompanyPrice) {
            await getNewCompanyPrice(selectedCompany)
          }
        }
      } else {
        selectedShipping = data.find((ship) => ship.locationName === event.target.value);
        setShipTo(selectedShipping);
      }
      let defaultPayment = {
        id: "",
            date: "",
            description: "",
            viewDate: ""
      }
      const getPaymentTerm = paymentOptions.find((item) => item.id === selectedCompany.defaultpaymentType );
      if (getPaymentTerm && getPaymentTerm.dueInDays) {
          const targetDate = add(new Date(), { days: getPaymentTerm.dueInDays });
          const dateForShopify = formatISO(targetDate)
          defaultPayment = {
            id: getPaymentTerm.id,
            date: dateForShopify,
            description: getPaymentTerm.description,
            viewDate: dateForShopify && format(new Date(dateForShopify), "MMMM dd yyyy"),
          };
      } 
      handleSubmit({ company: selectedCompany, shipToAddress: selectedShipping, selectedPayment:defaultPayment });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companies, handleSubmit, quotesList, setSelectedCompany, setShipTo, setShipToList]
  );

  const getNewCompanyPrice = async (selectedCompany) => {
    const reStructureQuote = quotesList.map((itm) => itm.productID);
    const newCompanyPrices = await GetCompanyProductsPrice({
      prodList: reStructureQuote,
      selectedCompany: [selectedCompany.shopifyCompanyLocationId],
    });
    quotesList.forEach((itm) => {
      const productID = itm.productID.replace("gid://shopify/Product/", "");
      const newVariantPrice = newCompanyPrices.newData.data[`prod_${productID}`].variants.edges;
      const variantData = newVariantPrice.find((item) => item.node.id === itm.variant.id);
      itm.variant.companyPrice.node = {
        ...itm.variant.companyPrice.node,
        [`company_${selectedCompany.shopifyCompanyLocationId}`]:
          variantData.node[`company_${selectedCompany.shopifyCompanyLocationId}`],
      };
    });
  };

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
              <MenuItem key={idx + 1} value={option.locationName}>
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
