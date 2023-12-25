import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  TextField,
  Checkbox,
  Divider,
  MenuItem,
  Unstable_Grid2 as Grid,
  Autocomplete,
  CardActions,
  Stack,
  Typography
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { MuiFileInput } from "mui-file-input";
import { usaState } from "src/data/state-usa";
import { useFormik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { GetCompanies, CheckUserEmail, RegisterUser, InviteUser } from "src/service/use-mongo";

export default function UsersAdd(props) {
  const { session } = props;
  const [loadSave, setLoadSave] = useState(false);
  const [companies, setCompanies] = useState([]);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const formik = useFormik({
    initialValues: {
      contactFirstName: "",
      contactLastName: "",
      phoneLocation: "",
      contactEmail: "",
      password: "",
      confirmPassword: "",
      avatar: "",
      role: "",
      companyName: "",
      submit: null,
    },
    validationSchema: Yup.object({
      contactFirstName: Yup.string().max(255).required("This field is required"),
      contactLastName: Yup.string().max(255).required("This field is required"),
      phoneLocation: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("This field is required"),
      contactEmail: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string().max(255).required("This field is required").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
      confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
      role: Yup.string().max(255).required("This field is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoadSave(true);
      if(values.role === "Customer" && !values.companyName) {
        formik.setErrors({companyName : "This field is required"});
        setLoadSave(false);
        return
      }

      const companyId = companies.find((item) => item.name === values.companyName)
      const checkUser = await CheckUserEmail(values.contactEmail);
      if (!checkUser) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Error sync with database!" });
        helpers.setSubmitting(false);
        setLoadSave(false);
        return
      }

      if (checkUser.data.length > 0) {
        formik.setErrors({contactEmail : "Is already taken"});
        setLoadSave(false);
        return
      }

      const resAddUser = await RegisterUser(values, companyId._id);
      if (!resAddUser) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Error sync with database!" });
        helpers.setSubmitting(false);
        setLoadSave(false);
        return; 
      }

      const resInvite = await InviteUser(values, resAddUser.data.insertedId);
      if (!resInvite && resInvite.status !== 200) {
        helpers.setStatus({ success: true });
        helpers.setErrors({ submit: "Error when sent invite email!" });
        helpers.setSubmitting(true);
        setLoadSave(false);
        return;
      }

      

      console.log("values", values)
      console.log("companies", companies)
      console.log("companyId", companyId)

      setLoadSave(false);
    },
  });

  useEffect(() => {
    GetCompaniesData(0, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const companyQuery = (role) => {
    switch (role) {
      case "customer":
        return { _id: session.user.detail.company.companyId };
      case "sales":
        return { sales: session.user.name };
      default:
        return;
    }
  };

  const GetCompaniesData = async (page, rowsPerPage) => {
    if (companies.length === 0) {
      const resGetCompanyList = await Promise.resolve(
        GetCompanies(page, rowsPerPage, companyQuery(session.user.detail.role))
      );
      if (!resGetCompanyList) {
        console.log("error get company data!");
        return;
      }
      setCompanies(resGetCompanyList.data.company);
    }
  };

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Stack>
        <Grid container spacing={2}>
          <Grid xs={12} md={12}>
            <Divider textAlign="left">User Info</Divider>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              id="contact-first-name"
              name="contactFirstName"
              label="First Name"
              variant="outlined"
              fullWidth
              required
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
              required
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
              required
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
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
              required
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phoneLocation}
              error={!!(formik.touched.phoneLocation && formik.errors.phoneLocation)}
              helperText={formik.touched.phoneLocation && formik.errors.phoneLocation}
            />
          </Grid>
          <Grid xs={12} md={12} mt={2}>
            <Divider textAlign="left">User Setting</Divider>
          </Grid>
          <Grid xs={12} md={3}>
            <TextField
              id="role"
              name="role"
              label="Role"
              variant="outlined"
              select
              fullWidth
              required
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.role}
              error={!!(formik.touched.role && formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="sales">
                <em>Sales</em>
              </MenuItem>
              <MenuItem value="Customer">
                <em>Customer</em>
              </MenuItem>
            </TextField>
          </Grid>
          {formik.values.role === "Customer" && (
            <Grid xs={12} md={3}>
              <TextField
                id="companyName"
                name="companyName"
                label="Company"
                variant="outlined"
                value={formik.values.companyName}
                select
                fullWidth
                onChange={formik.handleChange}
                error={!!(formik.touched.companyName && formik.errors.companyName)}
                helperText={formik.touched.companyName && formik.errors.companyName}
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
          )}
          <Grid xs={12} md={12} mt={2}>
            <Divider textAlign="left">User Setting</Divider>
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              id="password"
              name="password"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              required
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              error={!!(formik.touched.password && formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              variant="outlined"
              type="password"
              fullWidth
              required
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
          </Grid>
        </Grid>
      </Stack>
      <CardActions sx={{ justifyContent: "flext-start", mt: 3 }}>
        <LoadingButton
          color="primary"
          //onClick={() => setAddNewCompany()}
          loading={false}
          loadingPosition="start"
          startIcon={<CancelIcon />}
          variant="contained"
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          color="primary"
          //onClick={() => handleSubmit()}
          loading={loadSave}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          type="submit"
        >
          Save
        </LoadingButton>
        <br/>
        {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
      </CardActions>
    </form>
  );
}
