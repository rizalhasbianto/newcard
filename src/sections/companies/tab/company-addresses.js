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
  Tab,
  Tabs,
  Stack,
  Autocomplete,
  MenuItem,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { usaState } from 'src/data/state-usa'

import { UpdateCompanyShipToMongo } from 'src/service/use-mongo'

import { useFormik, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export const CompanyAddresses = () => {
  const [value, setValue] = useState("3");
  const handleChange = useCallback((event, newValue) => {
    console.log("newValue", newValue)
    setValue(newValue);
  }, []);

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const newUsaState = usaState.map((st) => {
    return ({
        label: st.name,
        name: st.name
    })
})
  const formik = useFormik({
    initialValues: {
        companyShippingLocation: "",
        countryName: "USA",
        stateName: "",
        attentionLocation: "",
        addressLocation: "",
        cityLocation: "",
        postalLocation: "",
        phoneLocation: "",
        submit: null
    },
    validationSchema: Yup.object({
        companyShippingLocation: Yup.string().max(255).required('This field is required'),
        countryName: Yup.string().max(255).required('This field is required'),
        stateName: Yup.object().required('This field is required'),
        attentionLocation: Yup.string().max(255).required('This field is required'),
        addressLocation: Yup.string().max(255).required('This field is required'),
        cityLocation: Yup.string().max(255).required('This field is required'),
        postalLocation: Yup.number().required('This field is required'),
        phoneLocation: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('This field is required')
    }),
    onSubmit: async (values, helpers) => {
        setLoadSave(true)

        if (submitCondition) {
            const resSaveCompany = await UpdateCompanyShipToMongo(values)
            if (!resSaveCompany) {
                toastUp.handleStatus("error")
                toastUp.handleMessage("Error when create company!")
                setLoadSave(false)
                return
            }

            const resAddUser = await RegisterUser(values, resSaveCompany.data.insertedId)
            if (!resAddUser) {
                toastUp.handleStatus("error")
                toastUp.handleMessage("Error when create user!")
                setLoadSave(false)
                return
            }

            const resInvite = await InviteUser(values, resAddUser.data.insertedId)
            if (!resInvite && resInvite.status !== 200) {
                toastUp.handleStatus("warning")
                toastUp.handleMessage("Company added, sent user invite failed!")
                setLoadSave(false)
                return
            }

            setLoadSave(false)
            toastUp.handleStatus("success")
            toastUp.handleMessage("Company added, sent user invite!")
            
            const shipToSelected = [{
                locationName: values.companyShippingLocation,
                location: {
                    attention: values.attentionLocation,
                    address: values.addressLocation,
                    city: values.cityLocation,
                    state: values.stateName.name,
                    zip: values.postalLocation,
                },
                default: true
            }]

            if(getSelectedVal) {
                const page = 0,
                rowsPerPage= 50
                const newCompaniesData = await GetCompanies(page, rowsPerPage)
                console.log("newCompaniesData", newCompaniesData)
                setCompanies(newCompaniesData.data.company)
                setCompanyName(values.companyName)
                setShipTo(values.companyShippingLocation)
                setShipToList(shipToSelected)
                setLocation(shipToSelected[0].location)
                setCompanyContact({
                    email:values.contactEmail,
                    name:values.contactFirstName + " " + values.contactLastName
                })
            }

            setAddNewCompany(false)
        }
    }
});

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: 345 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value} 
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            <Tab label="test1" value="1" />
            <Tab label="test2" value="2" />
            <Tab label="test3" value="3" />
          </Tabs>
        </Box>
        <TabPanel value="2" sx={{padding: "0 24px"}}>
        <Stack>
                <Grid container spacing={2} sx={{padding:0}}>
                    <Grid
                        xs={12}
                        md={5}
                    >
                        <TextField
                            id="company-shipping-location"
                            name="companyShippingLocation"
                            label="Shipping Location Name"
                            variant="outlined"
                            fullWidth
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.companyShippingLocation}
                            error={!!(formik.touched.companyShippingLocation && formik.errors.companyShippingLocation)}
                            helperText={formik.touched.companyShippingLocation && formik.errors.companyShippingLocation}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={3}
                    >
                        <TextField
                            id="country-name"
                            name="countryName"
                            label="Country"
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
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <Autocomplete
                            disablePortal
                            id="state"
                            name="stateName"
                            options={newUsaState}
                            fullWidth
                            isOptionEqualToValue={() => { return (true) }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="State"
                                    error={!!(formik.touched.stateName && formik.errors.stateName)}
                                    helperText={formik.touched.stateName && formik.errors.stateName}
                                />
                            }
                            onChange={(event, newValue) => {
                                formik.setFieldValue("stateName", newValue)
                            }}
                            onBlur={() => formik.setTouched({ ["stateName"]: true })}
                            value={formik.values.stateName}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={6}
                    >
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
                    <Grid
                        xs={12}
                        md={6}
                    >
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
                    <Grid
                        xs={12}
                        md={4}
                    >
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
                    <Grid
                        xs={12}
                        md={4}
                    >
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
                    <Grid
                        xs={12}
                        md={4}
                    >
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
            </Stack>
        </TabPanel>
    </Box>
  );
};
