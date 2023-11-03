import { useCallback, useState } from "react";
import { Box, CardActions, Divider, TextField, Unstable_Grid2 as Grid } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { UpdateCompanyInfoToMongo, CheckCompanyName, CheckUserEmail } from "src/service/use-mongo";

import { useFormik, ErrorMessage } from "formik";
import * as Yup from "yup";

export const CompanyEditDetails = (props) => {
  const { data, toastUp } = props;
  const [loadSave, setLoadSave] = useState(false);

  const contactName = data?.contact[0].name.split(" ");
  const formik = useFormik({
    initialValues: {
      id: data?._id,
      companyName: data?.name,
      companyAbout: data?.about,
      contactFirstName: contactName && contactName[0],
      contactLastName: contactName && contactName[1],
      contactEmail: data?.contact[0].email,
      phoneLocation: data?.contact.phone,
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

      let submitCondition = true;
      let errorFields = {};
      let resCheckCompanyName = {
        data: {
          company: [],
        },
      };
      let checkUser = {
        data: [],
      };

      if (values.companyName !== data?.name) {
        resCheckCompanyName = await CheckCompanyName(values.companyName);
      }

      if (values.contactEmail !== data?.contact[0].email) {
        checkUser = await CheckUserEmail(values.contactEmail);
      }

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
        errorFields.contactEmail = "Is already taken";
      }

      if (Object.keys(errorFields).length !== 0) {
        submitCondition = false;
        formik.setErrors(errorFields);
        setLoadSave(false);
        return;
      }

      if (submitCondition) {
        const resSaveCompany = await UpdateCompanyInfoToMongo(values);
        if (!resSaveCompany) {
          toastUp.handleStatus("error");
          toastUp.handleMessage("Error when create company!");
          setLoadSave(false);
          return;
        }

        setLoadSave(false);
        toastUp.handleStatus("success");
        toastUp.handleMessage("Company updated!");
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
          <Grid xs={12} md={6}>
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
          <Grid xs={12} md={6}>
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
          <Grid xs={12} md={6}>
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
          <Grid xs={12} md={6}>
            <TextField
              id="phone-location"
              name="phoneLocation"
              label="Phone"
              variant="outlined"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phoneLocation}
              error={!!(formik.touched.phoneLocation && formik.errors.phoneLocation)}
              helperText={formik.touched.phoneLocation && formik.errors.phoneLocation}
            />
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
          type="submit"
        >
          Save
        </LoadingButton>
      </CardActions>
    </form>
  );
};
