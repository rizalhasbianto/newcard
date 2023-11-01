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

import { useFormik, ErrorMessage } from "formik";
import * as Yup from 'yup';

export const CompanyEditDetails = () => {
  const formik = useFormik({
    initialValues: {
      companyName: "",
      companyAbout: "",
      contactFirstName: "",
      contactLastName: "",
      contactEmail: "",
      submit: null,
    },
    validationSchema: Yup.object({
      companyName: Yup.string().max(255).required("This field is required"),
      companyAbout: Yup.string().max(1000).required("This field is required"),
      contactFirstName: Yup.string().max(255).required("This field is required"),
      contactLastName: Yup.string().max(255).required("This field is required"),
      contactEmail: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoadSave(true);
      if (file) {
        values.companyPhoto = file.base64File;
      }

      let submitCondition = true;
      let errorFields = {};
      const resCheckCompanyName = await CheckCompanyName(values.companyName);
      const checkUser = await CheckUserEmail(values.contactEmail);

      if (!resCheckCompanyName || !checkUser) {
        submitCondition = false;
        toastUp.handleStatus("error");
        toastUp.handleMessage("Error checking to database!");
        setLoadSave(false);
      }

      if (resCheckCompanyName.data.company.length > 0) {
        errorFields.companyName = "Is already taken";
      }

      if (checkUser.data.length > 0) {
        errorFields.contactEmail = "Is already taken, have account? please login";
      }

      if (Object.keys(errorFields).length !== 0) {
        submitCondition = false;
        formik.setErrors(errorFields);
        setLoadSave(false);
        return;
      }

      if (submitCondition) {
        const resSaveCompany = await AddCompanyToMongo(values);
        if (!resSaveCompany) {
          toastUp.handleStatus("error");
          toastUp.handleMessage("Error when create company!");
          setLoadSave(false);
          return;
        }

        const resAddUser = await RegisterUser(values, resSaveCompany.data.insertedId);
        if (!resAddUser) {
          toastUp.handleStatus("error");
          toastUp.handleMessage("Error when create user!");
          setLoadSave(false);
          return;
        }

        const resInvite = await InviteUser(values, resAddUser.data.insertedId);
        if (!resInvite && resInvite.status !== 200) {
          toastUp.handleStatus("warning");
          toastUp.handleMessage("Company added, sent user invite failed!");
          setLoadSave(false);
          return;
        }

        setLoadSave(false);
        toastUp.handleStatus("success");
        toastUp.handleMessage("Company added, sent user invite!");

        const shipToSelected = [
          {
            locationName: values.companyShippingLocation,
            location: {
              attention: values.attentionLocation,
              address: values.addressLocation,
              city: values.cityLocation,
              state: values.stateName.name,
              zip: values.postalLocation,
            },
            default: true,
          },
        ];

        if (getSelectedVal) {
          const page = 0,
            rowsPerPage = 50;
          const newCompaniesData = await GetCompanies(page, rowsPerPage);
          console.log("newCompaniesData", newCompaniesData);
          setCompanies(newCompaniesData.data.company);
          setCompanyName(values.companyName);
          setShipTo(values.companyShippingLocation);
          setShipToList(shipToSelected);
          setLocation(shipToSelected[0].location);
          setCompanyContact({
            email: values.contactEmail,
            name: values.contactFirstName + " " + values.contactLastName,
          });
        }
        setAddNewCompany(false);
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
            <Divider textAlign="left">Contact</Divider>
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              id="contact-first-name"
              name="contactFirstName"
              label="First Name"
              variant="outlined"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.contactFirstName}
              error={!!(formik.touched.contactFirstName && formik.errors.contactFirstName)}
              helperText={formik.touched.contactFirstName && formik.errors.contactFirstName}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              id="contact-last-name"
              name="contactLastName"
              label="Last Name"
              variant="outlined"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.contactLastName}
              error={!!(formik.touched.contactLastName && formik.errors.contactLastName)}
              helperText={formik.touched.contactLastName && formik.errors.contactLastName}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              id="contact-email"
              name="contactEmail"
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.contactEmail}
              error={!!(formik.touched.contactEmail && formik.errors.contactEmail)}
              helperText={formik.touched.contactEmail && formik.errors.contactEmail}
            />
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ mb: 2, mt: 2 }} />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button variant="contained">Save details</Button>
      </CardActions>
    </form>
  );
};
