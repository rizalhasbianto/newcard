import { Button, Card, Stack, Typography } from "@mui/material";
import { format } from "date-fns-tz";

const CatalogInfo = (props) => {
  const { mongoCatalog, shopifyCatalog, setOnSync } = props;
  const lastUpdate = mongoCatalog.lastUpdateAt ? mongoCatalog.lastUpdateAt : mongoCatalog.createdAt
  return (
    <Card sx={{ mb: 2 }}>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} sx={{ p: 3 }}>
        <Typography variant="body2">Title: {shopifyCatalog.title}</Typography>
        <Typography variant="body2">Company: {shopifyCatalog.companyLocationsCount}</Typography>
        <Typography variant="body2">
          Last Sync: {format(new Date(lastUpdate), "MM-dd-yyyy / HH:mm:ss")}
        </Typography>
        <Button variant="outlined" onClick={() => setOnSync(true)}>Re-sync</Button>
      </Stack>
    </Card>
  );
};

export default CatalogInfo;
