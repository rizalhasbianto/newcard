import { useCallback, useState } from "react";
import {
  Box,
  CardActions,
  Divider,
  TextField,
  MenuItem,
  Unstable_Grid2 as Grid,
  Autocomplete,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import {
  UpdateCompanyInfoToMongo,
  CheckCompanyName,
  CheckUserEmail,
  GetUsers,
} from "src/service/use-mongo";

import { usaState } from "src/data/state-usa";
import { useFormik, ErrorMessage } from "formik";
import { paymentOptions } from "src/data/payment-options";
import * as Yup from "yup";

const CompanyDetailsEdit = (props) => {
  const { data, toastUp, setSwitchEditDetails, mutate } = props;
  const [loadSave, setLoadSave] = useState(false);

  const newUsaState = usaState.map((st) => {
    return {
      label: st.name,
      name: st.abbreviation,
    };
  });

  const page = 0;
  const postPerPage = 50;
  const query = { role: "sales" };
  const { data: users, isLoading } = GetUsers(page, postPerPage, "admin", query);

  const defaultContact = data?.contacts.find((item) => item.default).detail;
  const formik = useFormik({
    initialValues: {
      id: data?._id,
      companyName: data?.name,
      companyAbout: data?.about,
      address: data?.location.address,
      country: "USA",
      state: data?.location.state,
      city: data?.location.city,
      postal: data?.location.zip,
      contact: defaultContact.email,
      sales: data?.sales.id,
      shipping: data?.shipTo.find((item) => item.default).locationName,
      billing: data?.defaultBilling || "",
      paymentType: data?.defaultpaymentType || "",
      paymentTypeChange: data?.defaultpaymentTypeChange || "No",
      submit: null,
    },
    validationSchema: Yup.object({
      companyName: Yup.string().max(255).required("This field is required"),
      companyAbout: Yup.string().max(1000).required("This field is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoadSave(true);

      let submitCondition = true;
      let errorFields = {};
      let resCheckCompanyName = {
        data: {
          company: [],
        },
      };

      if (values.companyName !== data?.name) {
        resCheckCompanyName = await CheckCompanyName(values.companyName);
      }

      if (!resCheckCompanyName) {
        submitCondition = false;
        toastUp.handleStatus("error");
        toastUp.handleMessage("Error checking to database!");
        setLoadSave(false);
      }

      if (resCheckCompanyName.data.company.length > 0) {
        errorFields.companyName = "Is already taken";
      }

      if (Object.keys(errorFields).length !== 0) {
        submitCondition = false;
        formik.setErrors(errorFields);
        setLoadSave(false);
        return;
      }

      if (submitCondition) {
        if (values.sales !== data.sales.id) {
          const newSalesDefault = users.data.user.find((item) => item._id === values.sales);
          values.newSales = {
            id: newSalesDefault._id,
            name: newSalesDefault.name,
          };
        } else {
          values.newSales = data.sales;
        }

        if (defaultContact.email !== values.email) {
          const newContactDefault = [...data.contact];
          newContactDefault.map((item, i) => {
            if (item.email === values.contact) {
              item.default = true;
            } else {
              item.default = false;
            }
          });
          values.contact = newContactDefault;
        } else {
          values.contact = data.contact;
        }

        const resSaveCompany = await UpdateCompanyInfoToMongo(values);
        if (!resSaveCompany) {
          toastUp.handleStatus("error");
          toastUp.handleMessage("Error when update company!");
          setLoadSave(false);
          return;
        }
        mutate();
        setLoadSave(false);
        toastUp.handleStatus("success");
        toastUp.handleMessage("Company updated!");
        setSwitchEditDetails(true);
      }
    },
  });

  return (
    <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
      <Box sx={{ m: -1.5 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Divider textAlign="left">Company Info</Divider>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Company name"
              name="companyName"
              variant="outlined"
              required
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.companyName}
              error={!!(formik.touched.companyName && formik.errors.companyName)}
              helperText={formik.touched.companyName && formik.errors.companyName}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              id="company-about"
              name="companyAbout"
              label="Company about"
              variant="outlined"
              fullWidth
              multiline
              maxRows={3}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.companyAbout}
              error={!!(formik.touched.companyAbout && formik.errors.companyAbout)}
              helperText={formik.touched.companyAbout && formik.errors.companyAbout}
            />
          </Grid>
          <Grid xs={12} md={12}>
            <Divider textAlign="left">Company Address</Divider>
          </Grid>
          <Grid xs={12} md={8}>
            <TextField
              id="address"
              name="address"
              label="Address"
              variant="outlined"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.address}
              error={!!(formik.touched.address && formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid>
          <Grid xs={12} md={4}></Grid>
          <Grid xs={12} md={3}>
            <TextField
              id="country"
              name="country"
              label="Country"
              variant="outlined"
              value={formik.values.country}
              select
              fullWidth
              required
            >
              <MenuItem value="USA">
                <em>USA</em>
              </MenuItem>
            </TextField>
          </Grid>
          <Grid xs={12} md={3}>
            <Autocomplete
              disablePortal
              id="state"
              name="state"
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
                  error={!!(formik.touched.state && formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                />
              )}
              onChange={(event, newValue) => {
                formik.setFieldValue("state", newValue);
              }}
              onBlur={() => formik.setTouched({ ["state"]: true })}
              value={formik.values.state}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <TextField
              id="city"
              name="city"
              label="City"
              variant="outlined"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.city}
              error={!!(formik.touched.city && formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <TextField
              id="postal"
              name="postal"
              label="Postal"
              variant="outlined"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.postal}
              error={!!(formik.touched.postal && formik.errors.postal)}
              helperText={formik.touched.postal && formik.errors.postal}
            />
          </Grid>
          <Grid xs={12} md={12}>
            <Divider textAlign="left">Quote and Order Settings</Divider>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              id="contact"
              name="contact"
              label="Default Contact"
              variant="outlined"
              fullWidth
              select
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.contact}
              error={!!(formik.touched.contact && formik.errors.contact)}
              helperText={formik.touched.contact && formik.errors.contact}
            >
              {data?.contacts.map((item, i) => (
                <MenuItem value={item.detail.email} key={i + 1}>
                  <em>{item.detail.name}</em>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12} md={6}>
            {users && (
              <TextField
                id="sales"
                name="sales"
                label="Sales"
                variant="outlined"
                fullWidth
                select
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.sales}
                error={!!(formik.touched.sales && formik.errors.sales)}
                helperText={formik.touched.sales && formik.errors.sales}
              >
                {users.data.user.map((item, i) => (
                  <MenuItem value={item._id} key={i + 1}>
                    <em>{item.name}</em>
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              id="shipping"
              name="shipping"
              label="Default Shipping"
              variant="outlined"
              fullWidth
              select
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.shipping}
              error={!!(formik.touched.shipping && formik.errors.shipping)}
              helperText={formik.touched.shipping && formik.errors.shipping}
            >
              {data.shipTo.map((item, i) => (
                <MenuItem value={item.locationName} key={i + 1}>
                  <em>{item.locationName}</em>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              id="billing"
              name="billing"
              label="Default Billing"
              variant="outlined"
              fullWidth
              select
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.billing}
              error={!!(formik.touched.billing && formik.errors.billing)}
              helperText={formik.touched.billing && formik.errors.billing}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Company Address"}>
                <em>Company Address</em>
              </MenuItem>
              <MenuItem value={"Same as Shipping"}>
                <em>Same as Shipping</em>
              </MenuItem>
            </TextField>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              id="paymentType"
              name="paymentType"
              label="Default Payment Term"
              variant="outlined"
              fullWidth
              select
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.paymentType}
              error={!!(formik.touched.paymentType && formik.errors.paymentType)}
              helperText={formik.touched.paymentType && formik.errors.paymentType}
            >
              <MenuItem value="">
                <em>No payment plan</em>
              </MenuItem>
              {paymentOptions.map((item, i) => (
                <MenuItem value={item.id} key={i + 1}>
                  <em>{item.description}</em>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              id="paymentTypeChange"
              name="paymentTypeChange"
              label="Allow customer change payment term"
              variant="outlined"
              fullWidth
              select
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.paymentTypeChange}
              error={!!(formik.touched.paymentTypeChange && formik.errors.paymentTypeChange)}
              helperText={formik.touched.paymentTypeChange && formik.errors.paymentTypeChange}
            >
              <MenuItem value={"Yes"}>
                <em>Yes</em>
              </MenuItem>
              <MenuItem value={"No"}>
                <em>No</em>
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ mb: 2, mt: 2 }} />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <LoadingButton
          color="primary"
          loading={loadSave}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          onClick={() => setSwitchEditDetails(true)}
        >
          Cancel
        </LoadingButton>
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
      </CardActions>
    </form>
  );
};

export default CompanyDetailsEdit