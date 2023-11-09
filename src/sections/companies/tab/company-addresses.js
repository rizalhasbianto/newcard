import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Tab,
  Tabs,
  Stack,
  Autocomplete,
  MenuItem,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { usaState } from "src/data/state-usa";

import { UpdateCompanyShipToMongo, AddNewShipToMongo } from "src/service/use-mongo";

import { useFormik, ErrorMessage } from "formik";
import * as Yup from "yup";

export const CompanyAddresses = (props) => {
  const { data, toastUp, mutate } = props;
  const [value, setValue] = useState(1);
  const [loadSave, setLoadSave] = useState(false);
  const [newAddress, setNewAddress] = useState(false);

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
    if (newValue > data?.shipTo.length) {
      setNewAddress(true);
      formik.resetForm()
      formik.setValues({
        companyShippingLocation: "",
        countryName: "USA",
        stateName: "",
        attentionLocation: "",
        addressLocation: "",
        cityLocation: "",
        postalLocation: "",
      });
    } else {
      setNewAddress(false);
      const defaultAddress = data?.shipTo[newValue - 1];
      formik.setValues({
        companyShippingLocation: defaultAddress.locationName,
        countryName: "USA",
        stateName: { label: defaultAddress.location.state, name: defaultAddress.location.state },
        attentionLocation: defaultAddress.location.attention,
        addressLocation: defaultAddress.location.address,
        cityLocation: defaultAddress.location.city,
        postalLocation: defaultAddress.location.zip,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const newUsaState = usaState.map((st) => {
    return {
      label: st.name,
      name: st.name,
    };
  });
  const defaultAddress = data?.shipTo?.find((item) => item.default);
  const initialAddress = defaultAddress ? defaultAddress : data.shipTo[0];

  const formik = useFormik({
    initialValues: {
      companyShippingLocation: initialAddress.locationName,
      countryName: "USA",
      stateName: { label: initialAddress.location.state, name: initialAddress.location.state },
      attentionLocation: initialAddress.location.attention,
      addressLocation: initialAddress.location.address,
      cityLocation: initialAddress.location.city,
      postalLocation: initialAddress.location.zip,
      submit: null,
    },
    validationSchema: Yup.object({
      companyShippingLocation: Yup.string().max(255).required("This field is required"),
      countryName: Yup.string().max(255).required("This field is required"),
      stateName: Yup.object().required("This field is required"),
      attentionLocation: Yup.string().max(255).required("This field is required"),
      addressLocation: Yup.string().max(255).required("This field is required"),
      cityLocation: Yup.string().max(255).required("This field is required"),
      postalLocation: Yup.number().required("This field is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoadSave(true);
      let resSaveCompany;
      console.log("newAddress", newAddress)
      if (newAddress) {
        resSaveCompany = await AddNewShipToMongo(data._id, values, data.shipTo);
      } else {
        resSaveCompany = await UpdateCompanyShipToMongo(data._id, values, data.shipTo);
      }
      if (!resSaveCompany) {
        toastUp.handleStatus("error");
        toastUp.handleMessage("Error when create company!");
        setLoadSave(false);
        return;
      }

      mutate();
      setLoadSave(false);
      toastUp.handleStatus("success");
      toastUp.handleMessage("Company added, sent user invite!");
    },
  });

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: 345 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider", height: "100%" }}
        >
          {data &&
            data.shipTo.map((ship, i) => (
              <Tab label={ship.locationName} value={i + 1} key={i + 1} />
            ))}
          <Tab label="Add address" value={data.shipTo.length + 1} />
        </Tabs>
      </Box>
      <TabPanel value="2" sx={{ padding: "0 24px" }}>
        <Stack>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} sx={{ padding: 0 }}>
              <Grid xs={12} md={6}>
                <TextField
                  id="company-shipping-location"
                  name="companyShippingLocation"
                  label="Shipping Location Name"
                  variant="outlined"
                  fullWidth
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.companyShippingLocation}
                  error={
                    !!(
                      formik.touched.companyShippingLocation &&
                      formik.errors.companyShippingLocation
                    )
                  }
                  helperText={
                    formik.touched.companyShippingLocation && formik.errors.companyShippingLocation
                  }
                  disabled={!newAddress}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  id="attention-location"
                  name="attentionLocation"
                  label="Attention"
                  variant="outlined"
                  fullWidth
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.attentionLocation}
                  error={!!(formik.touched.attentionLocation && formik.errors.attentionLocation)}
                  helperText={formik.touched.attentionLocation && formik.errors.attentionLocation}
                />
              </Grid>
              <Grid xs={12} md={9}>
                <TextField
                  id="address-location"
                  name="addressLocation"
                  label="Address"
                  variant="outlined"
                  fullWidth
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.addressLocation}
                  error={!!(formik.touched.addressLocation && formik.errors.addressLocation)}
                  helperText={formik.touched.addressLocation && formik.errors.addressLocation}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <TextField
                  id="country-name"
                  name="countryName"
                  label="Country"
                  variant="outlined"
                  value={formik.values.countryName}
                  select
                  fullWidth
                  required
                  onChange={(e) => formik.setValues({ countryName: e.target.value })}
                >
                  <MenuItem value="USA">
                    <em>USA</em>
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <Autocomplete
                  disablePortal
                  id="state"
                  name="stateName"
                  options={newUsaState}
                  fullWidth
                  isOptionEqualToValue={() => {
                    return true;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      variant="outlined"
                      error={!!(formik.touched.stateName && formik.errors.stateName)}
                      helperText={formik.touched.stateName && formik.errors.stateName}
                    />
                  )}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("stateName", newValue);
                  }}
                  onBlur={() => formik.setTouched({ ["stateName"]: true })}
                  value={formik.values.stateName}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  id="city-location"
                  name="cityLocation"
                  label="City"
                  variant="outlined"
                  fullWidth
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.cityLocation}
                  error={!!(formik.touched.cityLocation && formik.errors.cityLocation)}
                  helperText={formik.touched.cityLocation && formik.errors.cityLocation}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  id="postal-location"
                  name="postalLocation"
                  label="Postal"
                  variant="outlined"
                  fullWidth
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.postalLocation}
                  error={!!(formik.touched.postalLocation && formik.errors.postalLocation)}
                  helperText={formik.touched.postalLocation && formik.errors.postalLocation}
                />
              </Grid>
              <Grid xs={12} md={8}></Grid>
              <Grid xs={12} md={4} sx={{ textAlign: "right" }}>
                <LoadingButton
                  color="primary"
                  loading={loadSave}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  type="submit"
                >
                  Save
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </Stack>
      </TabPanel>
    </Box>
  );
};
