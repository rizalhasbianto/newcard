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
  CheckUserEmail,
  RegisterUser,
  InviteUser,
} from "src/service/use-mongo";

import { useFormik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { phoneRegExp } from "src/data/company";

export const CompanyUsers = (props) => {
  const { data, toastUp, mutate } = props;
  const [value, setValue] = useState(1);
  const [loadSave, setLoadSave] = useState(false);
  const [loadSaveContact, setLoadSaveContact] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [defaultContact, setDefaultContact] = useState(data?.contact.find((item) => item.default));
  const initialDefaultDataContact = data?.contact.find((item) => item.default);
  const splitName = (name) => {
    return name.split(" ");
  };

  const formik = useFormik({
    initialValues: {
      email: data?.contact[0].email,
      firstName: splitName(data?.contact[0].name)[0],
      lastName:
        splitName(data?.contact[0].name)[1] +
        (splitName(data?.contact[0].name)[2] && " " + splitName(data?.contact[0].name)[2]),
      phone: data?.contact[0].phone,
      default: data?.contact[0].default,
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

      const checkUser = await CheckUserEmail(values.email);
      if (!checkUser) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Error sync with database!" });
        helpers.setSubmitting(false);
        setLoadSave(false);
        return;
      }
      if (checkUser.data.length > 0) {
        formik.setErrors({ email: "Is already taken" });
        setLoadSave(false);
        return;
      }

      if (!newUser) {
        const resUpdateuser = await UpdateCompanyUserToMongo(data._id, values, data.contact);
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
          phoneLocation: values.phone,
          companyName: data.name,
        };
        const resAddUser = await RegisterUser(userData, data._id);
        if (!resAddUser) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: "Error sync with database!" });
          helpers.setSubmitting(false);
          setLoadSave(false);
          return;
        }

        const addNewUser = await AddNewUserToCompanyMongo(
          data._id,
          userData,
          data.contact
        );
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
          toastUp.handleMessage("User Added but Error when sent invite email! Please resend invite");
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
      if (newValue > data?.contact.length) {
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
        const selectedAddress = data?.contact[newValue - 1];
        formik.setValues({
          email: selectedAddress.email,
          firstName: splitName(selectedAddress.name)[0],
          lastName:
            splitName(selectedAddress.name)[1] +
            (splitName(selectedAddress.name)[2] ? " " + splitName(selectedAddress.name)[2] : ""),
          phone: selectedAddress.phone,
          default: selectedAddress.default,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const handleSaveDefaultContact = useCallback(async () => {
    setLoadSaveContact(true);

    const resSaveData = await UpdateCompanyContactDefault(
      data._id,
      defaultContact.email,
      data.contact
    );

    if (!resSaveData) {
      toastUp.handleStatus("error");
      toastUp.handleMessage("Error when update default contact!");
      setLoadSaveContact(false);
    }

    toastUp.handleStatus("success");
    toastUp.handleMessage("Success update default contact!");
    setLoadSaveContact(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultContact]);

  return (
    <Box sx={{ m: -1.5 }}>
      <Grid 
      container 
      spacing={1} 
      alignItems={"center"} 
      justifyItems={"flex-start"}
    >
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
              value={defaultContact.email}
              select
              fullWidth
              required
              onChange={(event) =>
                setDefaultContact(data?.contact.find((item) => item.email === event.target.value))
              }
            >
              {data.contact.map((item, i) => (
                <MenuItem value={item.email} key={i + 1}>
                  <em>{item.name}</em>
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Grid>
        {defaultContact.email !== initialDefaultDataContact.email && (
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
              data.contact.map((contact, i) => (
                <Tab label={contact.name} value={i + 1} key={i + 1} sx={{ pr: 1 }} />
              ))}
            <Tab label="Add user" value={data.contact.length + 1} sx={{ pr: 1 }} />
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
