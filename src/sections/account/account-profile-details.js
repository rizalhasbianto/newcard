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
  Unstable_Grid2 as Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import { useFormik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { phoneRegExp } from "src/data/company";

import { UpdateCompanyUserToMongo, CheckUserEmail } from "src/service/use-mongo";
import { SyncUserShopify } from "src/service/use-shopify";

export const AccountProfileDetails = (props) => {
  const { userData, toastUp, mutate } = props;
  const [loadSave, setLoadSave] = useState(false);

  const splitName = (name) => {
    if (!name) return [];
    return name.split(" ");
  };

  const formik = useFormik({
    initialValues: {
      email: userData?.email,
      firstName: splitName(userData?.name)[0],
      lastName:
        splitName(userData?.name)[1] +
        (splitName(userData?.name)[2] ? " " + splitName(userData?.name)[2] : ""),
      phone: userData.detail?.phone,
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().max(255).required("This field is required"),
      firstName: Yup.string().max(255).required("This field is required"),
      lastName: Yup.string().max(255).required("This field is required"),
      phone: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("This field is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoadSave(true);
      if (values.email !== userData.email) {
        const checkUser = await CheckUserEmail(values.email);
        if (!checkUser) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: "Error sync with database!" });
          helpers.setSubmitting(false);
          setLoadSave(false);
          return;
        }
        if (checkUser.data.length > 0) {
          formik.setErrors({ email: "Is already been taken" });
          setLoadSave(false);
          return;
        }
      }
      const resSyncUser = await SyncUserShopify({
        contactFirstName: values.firstName,
        contactLastName: values.lastName,
        contactEmail: values.email,
        contactPhone: values.phone,
        shopifyCustomerId: userData.detail.shopifyCustomerId,
      });

      const shopifyRes = resSyncUser.resSyncCustomer.errors;
      const resSucessWithWarning = resSyncUser.resSyncCustomer.data.customerUpdate.userErrors;

      if (resSucessWithWarning.length > 0) {
        const errorMessage = resSucessWithWarning[0].message;
        toastUp.handleStatus("error");
        toastUp.handleMessage(errorMessage);
        setLoadSave(false);
        return;
      }
      if (!resSyncUser || (shopifyRes && shopifyRes.length > 0)) {
        const errorMessage =
          shopifyRes.length > 0 ? shopifyRes[0].message : "Error sync with Shopify!";

        if (errorMessage === "Email has already been taken") {
          const resGetUser = await GetUsersSwrhopify(userData.contactEmail);
          toastUp.handleStatus("error");
          toastUp.handleMessage("Error sync with Shopify!");
          setLoadSave(false);
        } else {
          toastUp.handleStatus("error");
          toastUp.handleMessage(errorMessage);
          setLoadSave(false);
        }
        return;
      }
      const resUpdateuser = await UpdateCompanyUserToMongo({
        id: userData.detail._id,
        userData: values,
      });
      if (!resUpdateuser) {
        toastUp.handleStatus("error");
        toastUp.handleMessage("Error update contact!");
        setLoadSave(false);
        return;
      }
      mutate();
      toastUp.handleStatus("success");
      toastUp.handleMessage("Success update contact!");
      setLoadSave(false);
    },
  });

  return (
    <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  error={!!(formik.touched.firstName && formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  error={!!(formik.touched.lastName && formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={!!(formik.touched.email && formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  id="phone"
                  name="phone"
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  error={!!(formik.touched.phone && formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
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
      </Card>
    </form>
  );
};
