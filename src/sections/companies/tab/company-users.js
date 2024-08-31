/* eslint-disable react/jsx-max-props-per-line */
import { useCallback, useState } from "react";
import {
  Box,
  Typography,
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
import TabPanel from "@mui/lab/TabPanel";

import {
  AddNewUserToCompanyMongo,
  UpdateCompanyUserToMongo,
  UpdateCompanyContactDefault,
  CheckUserEmail,
  RegisterUser,
  InviteUser,
} from "src/service/use-mongo";

import { SyncUserShopify, GetUserShopify } from "src/service/use-shopify";

import { useFormik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { phoneRegExp } from "src/data/company";

const CompanyUsers = (props) => {
  const { data, toastUp, mutate } = props;
  const [value, setValue] = useState(1);
  const [loadSave, setLoadSave] = useState(false);
  const [loadSaveContact, setLoadSaveContact] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [defaultContact, setDefaultContact] = useState(data?.contacts.find((item) => item.default));
  const initialDefaultDataContact = data?.contacts.find((item) => item.default);
  const splitName = (name) => {
    if (!name) return [];
    return name.split(" ");
  };

  const formik = useFormik({
    initialValues: {
      email: data?.contacts[0].detail?.email,
      firstName: splitName(data?.contacts[0].detail?.name)[0],
      lastName:
        splitName(data?.contacts[0].detail?.name)[1] +
        (splitName(data?.contacts[0].detail?.name)[2]
          ? " " + splitName(data?.contacts[0].detail?.name)[2]
          : ""),
      phone: data?.contacts[0].detail?.phone,
      default: data?.contacts[0].detail?.default,
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
      if (newUser || values.email !== data?.contacts[value - 1].detail.email) {
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

      if (!newUser) {
         const resUpdateuser = await UpdateCompanyUserToMongo(data._id, values, data.contacts);
         if (!resUpdateuser) {
           toastUp.handleStatus("error");
           toastUp.handleMessage("Error update contact!");
           setLoadSave(false);
           return;
         }
        toastUp.handleStatus("success");
        toastUp.handleMessage("Success update contact!");
        setLoadSave(false);
      } else {
        const userData = {
          contactFirstName: values.firstName,
          contactLastName: values.lastName,
          contactEmail: values.email,
          contactPhone: values.phone,
          companyName: data.name,
          shopifyCompanyId: data.shopifyCompanyId
        };

        let shopifyCustomerId, shopifyCompanyContactId;
        const resSyncUser = await SyncUserShopify(userData);
        const shopifyRes = resSyncUser.resSyncCustomer.data.companyContactCreate.userErrors;
        
        if (!resSyncUser || shopifyRes.length > 0) {
          const errorMessage =
            shopifyRes.length > 0 ? shopifyRes[0].message : "Error sync with Shopify!";

          if (errorMessage === "Email has already been taken") {
            const resGetUser = await GetUserShopify(userData.contactEmail);
            if (!resGetUser) { 
              toastUp.handleStatus("error");
              toastUp.handleMessage("Error sync with Shopify!");
              setLoadSave(false);
              return;
            }
            shopifyCustomerId = resGetUser.newData.data.customers.edges[0].node.id.replace(
              "gid://shopify/Customer/", ""
            );
            shopifyCompanyContactId = ""
          } else {
            toastUp.handleStatus("error");
            toastUp.handleMessage(errorMessage);
            setLoadSave(false);
            return;
          }
        } else {
          shopifyCustomerId = resSyncUser.resSyncCustomer.data.companyContactCreate.companyContact.customer.id.replace(
            "gid://shopify/Customer/", ""
          );
          shopifyCompanyContactId = resSyncUser.resSyncCustomer.data.companyContactCreate.companyContact.id.replace(
            "gid://shopify/CompanyContact/", ""
          );
        }

        const resAddUser = await RegisterUser(userData, data._id, shopifyCustomerId, shopifyCompanyContactId);
        if (!resAddUser) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: "Error sync with database!" });
          helpers.setSubmitting(false);
          setLoadSave(false);
          return;
        }

        const addNewUser = await AddNewUserToCompanyMongo({
          companyId: data._id,
          newUserData: { id: resAddUser.data.insertedId, default: false },
          userData: data.contacts,
          shopifyCustomerId,
          shopifyCompanyContactId
        });
        if (!addNewUser) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: "Error sync with database!" });
          helpers.setSubmitting(false);
          setLoadSave(false);
          return;
        }

        const resInvite = await InviteUser(userData, resAddUser.data.insertedId);
        if (!resInvite && resInvite.status !== 200) {
          toastUp.handleStatus("warning");
          toastUp.handleMessage(
            "User Added but Error when sent invite email! Please resend invite"
          );
          helpers.setSubmitting(true);
          setLoadSave(false);
          return;
        }

        mutate();
        toastUp.handleStatus("success");
        toastUp.handleMessage("Success add new contact!");
        setLoadSave(false);
      }
    },
  });

  const handleTabChange = useCallback(
    (event, newValue) => {
      setValue(newValue);
      if (newValue > data?.contacts.length) {
        setNewUser(true);
        formik.setValues({
          email: "",
          firstName: "",
          lastName: "",
          phone: "",
          default: false,
        });
      } else {
        setNewUser(false);
        const selectedUser = data?.contacts[newValue - 1].detail;
        formik.setValues({
          email: selectedUser.email,
          firstName: splitName(selectedUser.name)[0],
          lastName:
            splitName(selectedUser.name)[1] +
            (splitName(selectedUser.name)[2] ? " " + splitName(selectedUser.name)[2] : ""),
          phone: selectedUser.phone,
          default: selectedUser.default,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const handleSaveDefaultContact = useCallback(async () => {
    setLoadSaveContact(true);

    const resSaveData = await UpdateCompanyContactDefault({
      companyId: data._id,
      defaultContact: defaultContact.userId,
      userData: data.contacts,
    });

    if (!resSaveData) {
      toastUp.handleStatus("error");
      toastUp.handleMessage("Error when update default contact!");
      setLoadSaveContact(false);
    }

    mutate();
    toastUp.handleStatus("success");
    toastUp.handleMessage("Success update default contact!");
    setLoadSaveContact(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultContact]);

  return (
    <Box sx={{ m: -1.5 }}>
      <Grid container spacing={1} alignItems={"center"} justifyItems={"flex-start"}>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Default Contact
          </Typography>
        </Grid>
        <Grid item xs={6} md={4}>
          <Stack direction={"row"} spacing={1}>
            <Typography variant="subtitle2" color="neutral.500">
              :
            </Typography>
            <TextField
              id="defaultContact"
              name="defaultContact"
              label=""
              variant="standard"
              value={defaultContact.userId}
              select
              fullWidth
              required
              onChange={(event) =>
                setDefaultContact(data?.contacts.find((item) => item.userId === event.target.value))
              }
            >
              {data.contacts.map((item, i) => (
                <MenuItem value={item.userId} key={i + 1}>
                  <em>{item.detail?.name}</em>
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Grid>
        {defaultContact?.userId !== initialDefaultDataContact?.userId && (
          <Grid item xs={8} md={2}>
            <LoadingButton
              color="primary"
              loading={loadSaveContact}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="standard"
              type="submit"
              size="small"
              onClick={() => handleSaveDefaultContact()}
            />
          </Grid>
        )}
        <Grid item xs={12} md={12}>
          <Divider sx={{ mt: 2, mb: 2 }} />
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: 345 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleTabChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider", height: "100%" }}
          >
            {data &&
              data.contacts.map((contact, i) => (
                <Tab label={contact.detail?.name} value={i + 1} key={i + 1} sx={{ pr: 1 }} />
              ))}
            <Tab label="Add user" value={data.contacts.length + 1} sx={{ pr: 1 }} />
          </Tabs>
        </Box>
        <TabPanel value="2" sx={{ padding: "0 24px" }}>
          <Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Grid container spacing={2} sx={{ padding: 0 }}>
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
                <Grid xs={12} md={12}></Grid>
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
    </Box>
  );
};


export default CompanyUsers