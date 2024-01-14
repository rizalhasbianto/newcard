import { useState } from "react";
import { useRouter } from "next/router";
import { CreateCatalog } from "src/service/use-mongo";
import { format } from "date-fns-tz";

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Container,
  Stack,
  Unstable_Grid2 as Grid,
  Typography,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";

const CatalogPriceRule = (props) => {
  const { catalog, session } = props;
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const lastUpdate = catalog.lastUpdateAt ? catalog.lastUpdateAt : catalog.createdAt;

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
      <CardHeader subheader="Included 100 products" title="Global pricing" />
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        sx={{
          padding: "25px",
        }}
        spacing={2}
      >
        <Grid xs={6} md={3}>
          <TextField
            id="discountType"
            name="discountType"
            label="Adjusment"
            variant="outlined"
            select
            fullWidth
          >
            <MenuItem value="FIXED_AMOUNT">
              <em>Increase</em>
            </MenuItem>
            <MenuItem value="PERCENTAGE">
              <em>Decrease</em>
            </MenuItem>
          </TextField>
        </Grid>
        <Grid xs={6} md={3}>
          <TextField
            id="discountType"
            name="discountType"
            label="Type"
            variant="outlined"
            select
            fullWidth
          >
            <MenuItem value="FIXED_AMOUNT">
              <em>Fixed($)</em>
            </MenuItem>
            <MenuItem value="PERCENTAGE">
              <em>Percent(%)</em>
            </MenuItem>
          </TextField>
        </Grid>
        <Grid xs={6} md={3}>
          <TextField
            id="discountType"
            name="discountType"
            label="Amount"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid xs={6} md={3}>
          <LoadingButton
            color="primary"
            onClick={() => setAddCatalog(!addCatalog)}
            loading={false}
            loadingPosition="start"
            variant="outlined"
          >Save</LoadingButton>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CatalogPriceRule;
