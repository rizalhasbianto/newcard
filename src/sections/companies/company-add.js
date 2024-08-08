import React, { useState, useRef } from "react";
import { GetUsers } from "src/service/use-mongo";
import { paymentOptions } from "src/data/payment-options";
import {
  Box,
  TextField,
  FormLabel,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Divider,
  MenuItem,
  Unstable_Grid2 as Grid,
  Autocomplete,
  CardActions,
  Collapse,
  Stack,
  Typography,
  Chip
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { MuiFileInput } from "mui-file-input";
import { usaState } from "src/data/state-usa";
import { phoneRegExp } from "src/data/company";
import { useFormik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import {
  AddCompanyToMongo,
  CheckCompanyName,
  CheckUserEmail,
  RegisterUser,
  InviteUser,
  AddNewUserToCompanyMongo,
  GetCatalogSwr,
} from "src/service/use-mongo";

import { CreateCompanyShopify, GetShopifyCatalogs } from "src/service/use-shopify";

const AddCompany = (props) => {
  const { setAddNewCompany, toastUp, type, session, mutate, handleSetNewCompany } = props;

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

  const formik = useFormik({
    initialValues: {
      companyName: "",
      companyAbout: "",
      marked: "",
      useAsShipping: "yes",
      countryName: "USA",
      stateNameLocation: "",
      addressLocation: "",
      cityLocation: "",
      postalLocation: "",
      companyShippingName: "",
      stateNameShipping: "",
      addressShipping: "",
      cityShipping: "",
      postalShipping: "",
      contactFirstName: "",
      contactLastName: "",
      contactEmail: "",
      contactPhone: "",
      sales: "",
      catalog: [],
      defaultpaymentType: "",
      defaultpaymentTypeChange: "",
      submit: null,
    },
    validationSchema: Yup.object({
      companyName: Yup.string().max(255).required("This field is required"),
      companyAbout: Yup.string().max(1000).required("This field is required"),
      useAsShipping: Yup.string().max(255).required("This field is required"),
      stateNameLocation: Yup.object().required("This field is required"),
      addressLocation: Yup.string().max(1000).required("This field is required"),
      cityLocation: Yup.string().max(255).required("This field is required"),
      postalLocation: Yup.number().required("This field is required"),
      companyShippingName: Yup.string().when("useAsShipping", {
        is: "no",
        then: () => Yup.string().max(255).required("This field is required"),
      }),
      stateNameShipping: Yup.object().when("useAsShipping", {
        is: "no",
        then: () => Yup.object().required("This field is required"),
      }),
      addressShipping: Yup.string().when("useAsShipping", {
        is: "no",
        then: () => Yup.string().max(1000).required("This field is required"),
      }),
      cityShipping: Yup.string().when("useAsShipping", {
        is: "no",
        then: () => Yup.string().max(255).required("This field is required"),
      }),
      postalShipping: Yup.string().when("useAsShipping", {
        is: "no",
        then: () => Yup.number().required("This field is required"),
      }),
      contactFirstName: Yup.string().max(255).required("This field is required"),
      contactLastName: Yup.string().max(255).required("This field is required"),
      contactEmail: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      contactPhone: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("This field is required"),
      sales: Yup.object().required("This field is required"),
      defaultpaymentType: Yup.string().required("This field is required"),
      defaultpaymentTypeChange: Yup.string().required("This field is required"),
      catalog: Yup.array().min(1, "This field is required"),
    }),
    onSubmit: async (values, helpers) => {
      console.log("save run", values);
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
        let shopifyCompanyId, shopifyCompanyLocationId, shopifyCustomerId;
        const resCreateCompany = await CreateCompanyShopify(values);
        if (!resCreateCompany || resCreateCompany.data.userErrors.length > 0) {
          const errorMessage =
            resCreateCompany && resCreateCompany?.data.userErrors.length > 0
              ? `Error: ${resCreateCompany.data.userErrors[0].message}`
              : "Error sync with Shopify!";
          toastUp.handleStatus("error");
          toastUp.handleMessage(errorMessage);
          setLoadSave(false);
          return;
        } else {
          shopifyCompanyId = resCreateCompany.data.company.id.replace("gid://shopify/Company/", "");
          shopifyCompanyLocationId = resCreateCompany.data.company.locationID.replace(
            "gid://shopify/CompanyLocation/",
            ""
          );
          shopifyCustomerId = resCreateCompany.data.company.mainContact.customer.id.replace(
            "gid://shopify/Customer/",
            ""
          );
        }

        const resSaveCompany = await AddCompanyToMongo(
          values,
          shopifyCompanyId,
          shopifyCompanyLocationId
        );
        if (!resSaveCompany) {
          toastUp.handleStatus("error");
          toastUp.handleMessage("Error when create company!");
          setLoadSave(false);
          return;
        }

        const resAddUser = await RegisterUser(
          values,
          resSaveCompany.data.insertedId,
          shopifyCustomerId
        );
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

        const resAddUserToCompany = await AddNewUserToCompanyMongo({
          companyId: resSaveCompany.data.insertedId,
          newUserData: { id: resAddUser.data.insertedId, default: true },
          shopifyCustomerId: shopifyCustomerId,
        });

        if (!resAddUserToCompany) {
          toastUp.handleStatus("error");
          toastUp.handleMessage("Error when sync user to company!");
          setLoadSave(false);
          return;
        }
        if(handleSetNewCompany) {
          handleSetNewCompany({companyID:resSaveCompany.data.insertedId})
        } else {
          mutate()
        }
        
      }

      toastUp.handleStatus("success");
      toastUp.handleMessage("New Company added, user has been invited!");
      setLoadSave(false);
      setAddNewCompany(false);
      formik.resetForm();
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

  const page = 0;
  const postPerPage = 50;
  const query = { role: "sales" };
  const { data: users, isLoading } = GetUsers({ page, postPerPage, query });
  const {
    data: mongoCatalog,
    isLoading: mongoLoading,
    isError: mongoError,
    mutate: mongoCatalogmutate,
  } = GetCatalogSwr({
    page: 0,
    postPerPage: 50,
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      {
        // Company Info
      }
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
      {
        // Company Address
      }
      <Stack
        sx={{
          marginBottom: "30px",
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} md={12}>
            <Divider textAlign="left">Company Address</Divider>
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              id="use-as-shipping"
              name="useAsShipping"
              label="Use as shipping address"
              variant="outlined"
              value={formik.values.useAsShipping}
              select
              fullWidth
              required
              onChange={(e) => formik.setFieldValue("useAsShipping", e.target.value)}
            >
              <MenuItem value="yes">
                <em>Yes</em>
              </MenuItem>
              <MenuItem value="no">
                <em>No</em>
              </MenuItem>
            </TextField>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              id="address-location"
              name="addressLocation"
              label="Address"
              variant="outlined"
              fullWidth
              required
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
              onChange={(e) => formik.setFieldValue("countryName", e.target.value)}
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
              name="stateNameLocation"
              options={newUsaState}
              fullWidth
              isOptionEqualToValue={() => {
                return true;
              }}
              renderInput={(params, index) => (
                <TextField
                  {...params}
                  label="State"
                  variant="outlined"
                  required
                  key={index+1}
                  error={!!(formik.touched.stateNameLocation && formik.errors.stateNameLocation)}
                  helperText={formik.touched.stateNameLocation && formik.errors.stateNameLocation}
                />
              )}
              onChange={(event, newValue) => {
                formik.setFieldValue("stateNameLocation", newValue);
              }}
              onBlur={() => formik.setTouched({ ["stateNameLocation"]: true })}
              value={formik.values.stateNameLocation}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <TextField
              id="city-location"
              name="cityLocation"
              label="City"
              variant="outlined"
              fullWidth
              required
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
              required
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.postalLocation}
              error={!!(formik.touched.postalLocation && formik.errors.postalLocation)}
              helperText={formik.touched.postalLocation && formik.errors.postalLocation}
            />
          </Grid>
        </Grid>
      </Stack>
      {
        // Company Shipping
      }
      <Collapse in={formik.values.useAsShipping === "yes" ? false : true}>
        <Stack
          sx={{
            marginBottom: "30px",
          }}
        >
          <Grid container spacing={2}>
            <Grid xs={12} md={12}>
              <Divider textAlign="left">Shipping</Divider>
            </Grid>
            <Grid xs={12} md={4}>
              <TextField
                id="company-shipping-location"
                name="companyShippingName"
                label="Shipping Location Name"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.companyShippingName}
                error={!!(formik.touched.companyShippingName && formik.errors.companyShippingName)}
                helperText={formik.touched.companyShippingName && formik.errors.companyShippingName}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                id="address-location"
                name="addressShipping"
                label="Address"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.addressShipping}
                error={!!(formik.touched.addressShipping && formik.errors.addressShipping)}
                helperText={formik.touched.addressShipping && formik.errors.addressShipping}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                id="country-name-Shipping"
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
            <Grid xs={12} md={3}>
              <Autocomplete
                disablePortal
                id="state-Shipping"
                name="stateNameShipping"
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
                    error={!!(formik.touched.stateNameShipping && formik.errors.stateNameShipping)}
                    helperText={formik.touched.stateNameShipping && formik.errors.stateNameShipping}
                  />
                )}
                onChange={(event, newValue) => {
                  formik.setFieldValue("stateNameShipping", newValue);
                }}
                onBlur={() => formik.setTouched({ ["stateNameShipping"]: true })}
                value={formik.values.stateNameShipping}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                id="city-Shipping"
                name="cityShipping"
                label="City"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.cityShipping}
                error={!!(formik.touched.cityShipping && formik.errors.cityShipping)}
                helperText={formik.touched.cityShipping && formik.errors.cityShipping}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                id="postal-Shipping"
                name="postalShipping"
                label="Postal"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.postalShipping}
                error={!!(formik.touched.postalShipping && formik.errors.postalShipping)}
                helperText={formik.touched.postalShipping && formik.errors.postalShipping}
              />
            </Grid>
          </Grid>
        </Stack>
      </Collapse>
      {
        // Contact
      }
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
              name="contactPhone"
              label="Phone"
              variant="outlined"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.contactPhone}
              error={!!(formik.touched.contactPhone && formik.errors.contactPhone)}
              helperText={formik.touched.contactPhone && formik.errors.contactPhone}
            />
          </Grid>
          {session && session.user.detail.role === "admin" && (
            <>
              <Grid xs={12} md={12}>
                <Divider textAlign="left">B2B</Divider>
              </Grid>
              <Grid xs={12} md={type === "register" ? 6 : 3}>
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
                  {isLoading && (
                    <MenuItem value="">
                      <em>Loading...</em>
                    </MenuItem>
                  )}
                  {users &&
                    users.data.user.map((item, i) => (
                      <MenuItem value={item} key={i + 1}>
                        <em>{item.name}</em>
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </>
          )}
          {session &&
            (session.user.detail.role === "admin" || session.user.detail.role === "sales") && (
              <>
                <Grid xs={12} md={type === "register" ? 6 : 3}>
                  <TextField
                    id="defaultpaymentType"
                    name="defaultpaymentType"
                    label="Default payment Type"
                    variant="outlined"
                    fullWidth
                    select
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.defaultpaymentType}
                    error={
                      !!(formik.touched.defaultpaymentType && formik.errors.defaultpaymentType)
                    }
                    helperText={
                      formik.touched.defaultpaymentType && formik.errors.defaultpaymentType
                    }
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
                <Grid xs={12} md={type === "register" ? 3 : 3}>
                  <TextField
                    id="defaultpaymentTypeChange"
                    name="defaultpaymentTypeChange"
                    label="Allow customer change payment term?"
                    variant="outlined"
                    fullWidth
                    select
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.defaultpaymentTypeChange}
                    error={
                      !!(
                        formik.touched.defaultpaymentTypeChange &&
                        formik.errors.defaultpaymentTypeChange
                      )
                    }
                    helperText={
                      formik.touched.defaultpaymentTypeChange &&
                      formik.errors.defaultpaymentTypeChange
                    }
                  >
                    <MenuItem value={"Yes"}>
                      <em>Yes</em>
                    </MenuItem>
                    <MenuItem value={"No"}>
                      <em>No</em>
                    </MenuItem>
                  </TextField>
                </Grid>
              </>
            )}
          <Grid xs={12} md={6}>
            <Stack direction={"row"} alignItems={"end"}>
              <FormLabel error={!!(formik.touched.catalog && formik.errors.catalog)} sx={{ mr: 1 }}>
                Catalogs
              </FormLabel>
              {formik.errors.catalog && <FormHelperText>At least choose 1</FormHelperText>}
            </Stack>
            {mongoCatalog?.data.map((catalog, idx) => (
              <FormControlLabel
                key={idx + 1}
                control={
                  <Checkbox
                    checked={formik.values.catalog.includes(catalog.shopifyCatalogID)}
                    value={catalog.shopifyCatalogID}
                    onChange={formik.handleChange}
                    name="catalog"
                  />
                }
                label={catalog.shopifyCatalogName}
              />
            ))}
          </Grid>
          <Grid xs={12} md={12}></Grid>
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
};

export default AddCompany;
