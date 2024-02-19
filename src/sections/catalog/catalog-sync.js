import { useCallback, useRef, useState, useEffect } from "react";
import { GetSyncCatalogProducts, UpdateProductMetafield } from "src/service/use-shopify";
import { CreateCatalog } from "src/service/use-mongo"
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  Slide,
  Collapse,
  Unstable_Grid2 as Grid,
  Button,
  CircularProgress,
  LinearProgress,
} from "@mui/material";

const CatalogSync = (props) => {
    const { catalogId, session, shopifyCatalog } = props

  const [onSync, setOnSync] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ createMongoCatalog:"no", getProducts: "no", syncProducts: "no" });
  const [syncNewProductList, setSyncNewProductList] = useState([]);
  const [syncRemovedProductList, setSyncRemovedProductList] = useState([]);
  const [syncResult, setSyncResult] = useState([]);

  const handleSyncCatalog = async () => {
    setOnSync(true);
    setSyncStatus({ getProducts: "progress", syncProducts: "no" });
    const getSyncData = await GetSyncCatalogProducts(catalogId);

    if (getSyncData) {
        console.log("getSyncData.newData", getSyncData.newData)
      setSyncStatus({ createMongoCatalog:"no", getProducts: "success", syncProducts: "no" });
      const resMongo = await CreateCatalog({
        shopifyCatalog: getSyncData.newData,
        session,
        catalogId,
      });
      if (!resMongo) {
        setSyncStatus({ createMongoCatalog:"error", getProducts: "error", syncProducts: "no" });
        return
      }
      setSyncStatus({ createMongoCatalog:"success", getProducts: "success", syncProducts: "no" });
      setSyncNewProductList(getSyncData.newData.newId);
      setSyncRemovedProductList(getSyncData.newData.removeId);
    } else {
      setSyncStatus({ createMongoCatalog:"error", getProducts: "error", syncProducts: "no" });
    }
  };

  const upddatingProducts = async(item, catalogId, type) => {
    const resUpdateMetafield = await UpdateProductMetafield({
        productId: item.node.id,
        catalogId: catalogId,
        shopifyCatalog: item.node.shopifyCatalog,
      });
      if (
        !resUpdateMetafield ||
        resUpdateMetafield.updateMetafield.data.productUpdate.userErrors.length > 0
      ) {
        setSyncResult([...syncResult, {
            type,
            prodID:item.node.id,
            status:"error"
        }])
      } else {
        setSyncResult([...syncResult, {
            type,
            prodID:item.node.id,
            status:"success"
        }])
      }
      return
  }
  const handleSyncProducts = async () => {
    setSyncStatus({ createMongoCatalog:"success", getProducts: "done", syncProducts: "progress" });
    if(syncNewProductList.length > 0) {
        for (const item of syncNewProductList) {
            await upddatingProducts(item, catalogId, "add")
        }
    }
    if(syncRemovedProductList.length > 0) {
        for (const item of syncRemovedProductList) {
            await upddatingProducts(item, catalogId, "remove")
        }
    }
  };

  return (
    <Card>
      <CardContent>
        <Collapse in={!onSync}>
          <Stack spacing={1} direction={"row"} alignItems={"center"} justifyContent={"center"}>
            <Typography variant="subtitle1" textAlign={"center"}>
              This catalog is not synced with app yet!
            </Typography>
            <Button variant="outlined" onClick={handleSyncCatalog}>
              Sync
            </Button>
          </Stack>
        </Collapse>
        <Collapse in={onSync}>
          <Stack spacing={1} direction={"column"} alignItems={"center"} justifyContent={"center"}>
            {(syncStatus.getProducts === "error" || syncStatus.syncProducts === "error") && (
              <Typography variant="subtitle1">Error sync data!</Typography>
            )}
            {syncStatus.getProducts === "progress" && (
              <>
                <Typography variant="subtitle1">Getting sync data</Typography>
                <CircularProgress />
              </>
            )}
            {syncStatus.getProducts === "success" && (
              <Box>
                <Typography variant="subtitle1">
                  New Products: {syncNewProductList.length}
                </Typography>
                <Typography variant="subtitle1">
                  Remove Products: {syncRemovedProductList.length}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  size="small"
                  onClick={handleSyncProducts}
                >
                  Start Sync
                </Button>
              </Box>
            )}
            {syncStatus.syncProducts === "progress" && (
              <Box>
                <Typography variant="subtitle1">
                  Sync was on progress please do not close the window!!!
                </Typography>
                <LinearProgress variant="determinate" value={40} sx={{ mt: 1, mb: 1 }} />
                <Typography variant="body2">Phase : adding product to catalog 1/102</Typography>
                <Typography variant="body2">Succes product sync : 1</Typography>
                <Typography variant="body2">Error product sync : 1</Typography>
              </Box>
            )}
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default CatalogSync;
