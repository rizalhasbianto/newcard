import { Box, Button, Divider, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export const CompanyDetails = (props) => {
  const { data, toastUp, setSwitchEditDetails } = props;

  return (
    <Box sx={{ m: -1.5 }}>
      <Grid container spacing={1} alignItems={"center"}>
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
          <Typography variant="subtitle2">: {data.about}</Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Address
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">: {data.location.address}</Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Default Contact
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">: {data?.contact.find((item) => item.default).name}</Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Default Shipping
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">: {data?.shipTo.find((item) => item.default).locationName}</Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Default Billing
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">: Same as Shipping</Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Catalog
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">: No Catalog</Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Default payment type
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">: 7 days</Typography>
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Allow customer change payment type
          </Typography>
        </Grid>
        <Grid item xs={8} md={9}>
          <Typography variant="subtitle2">: No</Typography>
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
