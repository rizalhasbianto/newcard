import { useState } from "react";
import { useRouter } from "next/router";
import { CreateCatalog } from "src/service/use-mongo";
import { format } from "date-fns-tz";

import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Unstable_Grid2 as Grid,
  Typography,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";

const CatalogInfo = (props) => {
  const { catalog, session} = props;
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const lastUpdate = catalog.lastUpdateAt ? catalog.lastUpdateAt : catalog.createdAt

  const handleCreateCatalog = async (props) => {
    setLoading(true);
    const resMongo = await CreateCatalog(type);
    if (!resMongo) {
      toastUp.handleStatus("error");
      toastUp.handleMessage("Failed create new catalog!!!");
    }
    router.push("/products/catalogs/" + resMongo.data.insertedId);
    setLoading(false);
  };
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
        <Grid xs={6} md={3}>
          <Typography variant="body2">Id: #{catalog._id.slice(-4)}</Typography>
        </Grid>
        <Grid xs={6} md={3}>
          <Typography variant="body2">Type: {catalog.type}</Typography>
        </Grid>
        <Grid xs={6} md={3}>
          <Typography variant="body2">Applied: {catalog.applied ? catalog.applied : 0}</Typography>
        </Grid>
        <Grid xs={6} md={3}>
          <Typography variant="body2">LastUpdate: {format(new Date(lastUpdate), "MM-dd-yyyy")}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CatalogInfo;
