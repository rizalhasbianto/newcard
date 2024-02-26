import { Button, Card, Stack, Typography } from "@mui/material";

const CatalogInfo = (props) => {
  const { mongoCatalog, shopifyCatalog, setOnSync } = props;
  //const lastUpdate = catalog.lastUpdateAt ? catalog.lastUpdateAt : catalog.createdAt
console.log("mongoCatalog 5", mongoCatalog)
  return (
    <Card sx={{ mb: 2 }}>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} sx={{ p: 3 }}>
        <Typography variant="body2">Title: {shopifyCatalog.title}</Typography>
        <Typography variant="body2">Company: {shopifyCatalog.companyLocationsCount}</Typography>
        <Typography variant="body2">
          Last Sync: {mongoCatalog ? "11-Jan-2015" : "Never Sync"}
        </Typography>
        <Button variant="outlined" onClick={() => setOnSync(true)}>Re-sync</Button>
      </Stack>
    </Card>
  );
};

export default CatalogInfo;
