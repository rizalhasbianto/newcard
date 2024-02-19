import { Card, Unstable_Grid2 as Grid, Typography } from "@mui/material";

const CatalogInfo = (props) => {
  const { mongoCatalog, shopifyCatalog } = props;
  //const lastUpdate = catalog.lastUpdateAt ? catalog.lastUpdateAt : catalog.createdAt

  return (
    <Card sx={{ mb: 2 }}>
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        sx={{
          padding: "25px",
        }}
      >
        <Grid xs={6} md={4}>
          <Typography variant="body2">Title: {shopifyCatalog.title}</Typography>
        </Grid>
        <Grid xs={6} md={4}>
          <Typography variant="body2">
            Sync Status: {mongoCatalog ? "Last Sync 11-Jan-2015" : "Never Sync"}
          </Typography>
        </Grid>
        <Grid xs={6} md={4}>
          <Typography variant="body2">Company: {shopifyCatalog.companyLocationsCount}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CatalogInfo;
