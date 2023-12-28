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
import { usaState } from "src/data/state-usa";

import { UpdateCompanyShipToMongo, AddNewShipToMongo } from "src/service/use-mongo";

import { useFormik, ErrorMessage } from "formik";
import * as Yup from "yup";

export const CompanyUsers = (props) => {
  const { data, toastUp, mutate } = props;
  const [value, setValue] = useState(1);
  const [loadSave, setLoadSave] = useState(false);
  const [newAddress, setNewAddress] = useState(false);
  console.log("data ship", data);
  const handleChange = useCallback(
    (event, newValue) => {
      setValue(newValue);
      if (newValue > data?.shipTo.length) {
        setNewAddress(true);
        formik.resetForm();
        formik.setValues({
          email: "",
          firstName: "USA",
          lastName: "",
          phone: "",
          default: "",
        });
      } else {
        setNewAddress(false);
        const defaultAddress = data?.shipTo[newValue - 1];
        formik.setValues({
          email: defaultAddress.locationName,
          firstName:"",
          lastName: "",
          phone: "",
          default: "",
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [data]
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName:"",
      phone: "",
      default:"",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().max(255).required("This field is required"),
      firstName: Yup.string().max(255).required("This field is required"),
      lastName: Yup.string().max(255).required("This field is required"),
      phone: Yup.object().required("This field is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoadSave(true);
      setLoadSave(false);
      toastUp.handleStatus("success");
      toastUp.handleMessage("Company added, sent user invite!");
    },
  });

  return (
    <Box sx={{ m: -1.5 }}>
      <Grid container spacing={1} alignItems={"center"} justifyItems={"flex-start"}>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Default Contact
          </Typography>
        </Grid>
        <Grid itemxs={8} md={4}>
          <Stack direction={"row"}>
          <Typography variant="subtitle2" color="neutral.500">:</Typography>
        <TextField
              id="country"
              name="country"
              label=""
              variant="standard"
              value={"rizal donat"}
              select
              fullWidth
              required
            >
              <MenuItem value="rizal donat">
                <em>rizal donat</em>
              </MenuItem>
              <MenuItem value="rizal donat">
                <em>rizal brownies</em>
              </MenuItem>
            </TextField>
          </Stack>
        </Grid>
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
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider", height: "100%" }}
          >
            {data &&
              data.shipTo.map((ship, i) => (
                <Tab label={ship.locationName} value={i + 1} key={i + 1} sx={{ pr: 1 }} />
              ))}
            <Tab label="Add address" value={data.shipTo.length + 1} sx={{ pr: 1 }} />
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
                    error={
                      !!(
                        formik.touched.firstName &&
                        formik.errors.firstName
                      )
                    }
                    helperText={
                      formik.touched.firstName &&
                      formik.errors.firstName
                    }
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
                <Grid xs={12} md={12}>
                </Grid>
                <Grid xs={12} md={8}>
                </Grid>
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
