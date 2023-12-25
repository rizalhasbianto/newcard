import React, { useState, useRef } from "react";
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
import {
  AddCompanyToMongo,
  CheckCompanyName,
  CheckUserEmail,
  RegisterUser,
  InviteUser,
} from "src/service/use-mongo";

export default function AddCompany(props) {
  const {
    setAddNewCompany,
    toastUp,
    getSelectedVal,
    setCompanies,
    setShipToList,
    setLocation,
    setShipTo,
    setCompanyName,
    GetCompanies,
    setCompanyContact,
    type,
  } = props;

  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [loadSave, setLoadSave] = useState(false);
  const [fileError, setFileError] = useState(false);
  const newUsaState = usaState.map((st) => {
    return {
      label: st.name,
      name: st.abbreviation,
    };
  });
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const formik = useFormik({
    initialValues: {
      companyName: "",
      companyAbout: "",
      marked: "",
      companyShippingLocation: "",
      countryName: "USA",
      stateName: "",
      attentionLocation: "",
      addressLocation: "",
      cityLocation: "",
      postalLocation: "",
      phoneLocation: "",
      contactFirstName: "",
      contactLastName: "",
      contactEmail: "",
      submit: null,
    },
    validationSchema: Yup.object({
      companyName: Yup.string().max(255).required("This field is required"),
      companyAbout: Yup.string().max(1000).required("This field is required"),
      companyShippingLocation: Yup.string().max(255).required("This field is required"),
      countryName: Yup.string().max(255).required("This field is required"),
      stateName: Yup.object().required("This field is required"),
      attentionLocation: Yup.string().max(255).required("This field is required"),
      addressLocation: Yup.string().max(255).required("This field is required"),
      cityLocation: Yup.string().max(255).required("This field is required"),
      postalLocation: Yup.number().required("This field is required"),
      phoneLocation: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("This field is required"),
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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  async function handleChangeFile(newFile) {
    if (!newFile) {
      setFile();
      setPreview();
      return;
    }
    if (newFile.size < 200000) {
      const base64Img = await convertToBase64(newFile);
      setFile({ photo: newFile, base64File: base64Img });
      setPreview(URL.createObjectURL(newFile));
      setFileError(false);
    } else {
      setFileError(true);
    }
  }

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Stack
        sx={{
          marginBottom: "30px",
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} md={12}>
            <Divider textAlign="left">Company Info</Divider>
          </Grid>
          <Grid xs={12} md={type === "register" ? 5 : 3}>
            <TextField
              id="company-name"
              name="companyName"
              label="Company Name"
              variant="outlined"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.companyName}
              error={!!(formik.touched.companyName && formik.errors.companyName)}
              helperText={formik.touched.companyName && formik.errors.companyName}
            />
          </Grid>
          <Grid xs={12} md={type === "register" ? 5 : 4}>
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
          <Grid xs={12} md={type === "register" ? 5 : file ? 3 : 4}>
            <MuiFileInput
              value={file?.photo}
              onChange={handleChangeFile}
              variant="outlined"
              name="companyPhoto"
              label="Please choose Photo max 200kb"
              inputProps={{ accept: ".png, .jpeg, .jpg" }}
              getInputText={(value) => (value ? file.photo.name : "")}
              fullWidth
              className={file ? "selected_file" : "empty"}
              helperText={fileError && "Image size is above 200kb"}
              error={fileError}
            />
          </Grid>
          {file && (
            <Grid xs={12} md={1}>
              <Box>
                <div className="preview-wrap">
                  <Image
                    src={preview}
                    fill={true}
                    alt="Picture of the author"
                    className="shopify-fill"
                    sizes="270 640 750"
                  />
                </div>
              </Box>
            </Grid>
          )}
          <Grid xs={12} md={1}>
            <Checkbox
              icon={<BookmarkBorderIcon />}
              checkedIcon={<BookmarkIcon />}
              name="marked"
              id="marked"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.marked}
            />
          </Grid>
        </Grid>
      </Stack>
      <Stack
        sx={{
          marginBottom: "30px",
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} md={12}>
            <Divider textAlign="left">Shipping</Divider>
          </Grid>
          <Grid xs={12} md={5}>
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
                !!(formik.touched.companyShippingLocation && formik.errors.companyShippingLocation)
              }
              helperText={
                formik.touched.companyShippingLocation && formik.errors.companyShippingLocation
              }
            />
          </Grid>
          <Grid xs={12} md={5}></Grid>
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
          <Grid xs={12} md={6}>
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
          <Grid xs={12} md={2}>
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
          <Grid xs={12} md={3}>
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
          <Grid xs={12} md={3}>
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
        </Grid>
      </Stack>
      <Stack>
        <Grid container spacing={2}>
          <Grid xs={12} md={12}>
            <Divider textAlign="left">Contact</Divider>
          </Grid>
          <Grid xs={12} md={type === "register" ? 6 : 3}>
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
          <Grid xs={12} md={type === "register" ? 6 : 3}>
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
          <Grid xs={12} md={type === "register" ? 6 : 3}>
            <TextField
              id="contact-email"
              name="contactEmail"
              label="Email"
              variant="outlined"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.contactEmail}
              error={!!(formik.touched.contactEmail && formik.errors.contactEmail)}
              helperText={formik.touched.contactEmail && formik.errors.contactEmail}
            />
          </Grid>

          <Grid xs={12} md={type === "register" ? 6 : 3}>
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
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <LoadingButton
              color="primary"
              onClick={() => setAddNewCompany()}
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
          </CardActions>
        </Grid>
      </Stack>
    </form>
  );
}
