import { Box, Button, Divider, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Stack } from "@mui/system";
import { paymentOptions } from "src/data/payment-options";

const CompanyDetails = (props) => {
  const { data, catalogs, toastUp, setSwitchEditDetails } = props;
  console.log("data", data)
  const defaultPayment = paymentOptions.find((itm) => itm.id === data?.defaultpaymentType)
  const selectedCatalog = catalogs && catalogs.newData.filter((itm) => data.catalogIDs.some((catalog) => itm.node.id.includes(catalog)))

  return (
    <Box sx={{ m: -1.5 }}>
      <Grid container spacing={1} alignItems={"flex-start"} justifyItems={"flex-start"}>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Name
          </Typography>
        </Grid>
        <Grid itemxs={8} md={9}>
          <Typography variant="subtitle2">: {data.name}</Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            About
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Stack direction={"row"}>
            <Typography variant="subtitle2" sx={{ mr: "4px" }}>
              :
            </Typography>
            <Typography variant="subtitle2"> {data.about}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Address
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2" color={data.location.address ? "#000" : "neutral.500"}>
            : {data.location.address} {data.location.city} {data.location.state.label}{" "}
            {data.location.address && ","} {data.location.zip + " "}{" "}
            {data.location.address ? "United States" : "Address not set"}
          </Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Default Contact
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">
            : {data?.contacts.find((item) => item.default)?.detail?.name}
          </Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Default Shipping
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">
            : {data?.shipTo.find((item) => item.default).locationName}
          </Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Default Billing
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2" color={data.defaultBilling ? "#000" : "neutral.500"}>
            : {data.defaultBilling ? data.defaultBilling : "Default billing not set"}
          </Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Catalogs
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">: {selectedCatalog?.map((itm, index) => index === 0 ? `${itm.node.title}` : `, ${itm.node.title}`)}</Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Default payment term
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2" color={data.defaultpaymentType ? "#000" : "neutral.500"}>
            : {defaultPayment? `${defaultPayment.name} (${defaultPayment.description})` : "Default payment term not set"}
          </Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Allow customer change payment term
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">: {data.defaultpaymentTypeChange}</Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Featured company
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">: {data.marked ? "Yes" : "No"}</Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Sales
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">: {data.sales.name}</Typography>
        </Grid>
        <Grid xs={12} md={12}>
          <Divider sx={{ mt: 2, mb: 2 }} />
        </Grid>
        <Grid xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<EditIcon color="action" fontSize="small" />}
            onClick={() => setSwitchEditDetails(false)}
          >
            Edit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyDetails