import { useCallback, useRef, useState, useEffect } from "react";
import CsvDownloadButton from "react-json-to-csv";
import { GetSyncCatalogProducts, UpdateProductMetafield } from "src/service/use-shopify";
import { CreateCatalog, UpdateCatalog } from "src/service/use-mongo";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  CircularProgress,
  LinearProgress,
} from "@mui/material";

const CatalogSync = (props) => {
  const {
    catalogId,
    session,
    shopifyCatalog,
    mongoCatalog,
    mongoCatalogmutate,
    onSync,
    setOnSync,
  } = props;

  const [syncStatus, setSyncStatus] = useState({
    createMongoCatalog: "no",
    getProducts: "no",
    syncProducts: "no",
  });
  const [syncResult, setSyncResult] = useState([]);
  const [syncCount, setSyncCount] = useState(0);
  const [syncProgress, setSyncProgress] = useState({
    phase: "",
    count: 0,
    total: 0,
  });
  const [syncMessage, setSyncMessage] = useState({
    progress: 0,
    success: 0,
    error: 0,
  });

  useEffect(() => {
    if (onSync) {
      handleSyncCatalog();
    }
  }, [onSync]);

  const handleSyncCatalog = async () => {
    let createMongoCatalogProgress = "no";
    let syncProductsProgress = "no";

    setSyncStatus({ createMongoCatalog: "no", getProducts: "progress", syncProducts: "no" });

    const getSyncData = await GetSyncCatalogProducts(catalogId);
    if (getSyncData) {
      setSyncStatus({ createMongoCatalog: "no", getProducts: "done", syncProducts: "progress" });
      const syncNewProductList = getSyncData.newData.newId;
      const syncRemovedProductList = getSyncData.newData.removeId;
      const totalSyncData = syncNewProductList.length + syncRemovedProductList.length;
      setSyncCount(totalSyncData);

      if (totalSyncData > 0) {
        const resSyncProducts = await handleSyncProducts(
          syncNewProductList,
          syncRemovedProductList
        );
        if (resSyncProducts) {
          syncProductsProgress = "done";
        } else {
          syncProductsProgress = "error";
        }
      } else {
        syncProductsProgress = "done";
      }
      setSyncStatus({
        createMongoCatalog: "no",
        getProducts: "done",
        syncProducts: syncProductsProgress,
      });

      if (mongoCatalog.data.length === 0) {
        setSyncStatus({
          createMongoCatalog: "progress",
          getProducts: "done",
          syncProducts: syncProductsProgress,
        });
        const resCreateMongoCatalog = await handleMongoCatalog(getSyncData);
        if (resCreateMongoCatalog) {
          createMongoCatalogProgress = "done";
        } else {
          createMongoCatalogProgress = "error";
        }
      } else {
        createMongoCatalogProgress = "done";
      }

      setSyncStatus({
        createMongoCatalog: createMongoCatalogProgress,
        getProducts: "done",
        syncProducts: syncProductsProgress,
      });
      return;
    } else {
      setSyncStatus({ createMongoCatalog: "no", getProducts: "error", syncProducts: "no" });
      return;
    }
  };

  const handleSyncProducts = async (syncNewProductList, syncRemovedProductList) => {
    const tempSyncResult = [];
    if (syncNewProductList.length > 0) {
      let count = 0;
      for (const item of syncNewProductList) {
        const resUpdateProduct = await upddatingProducts(item, catalogId, "add");
        tempSyncResult.push(resUpdateProduct);
        setSyncResult(tempSyncResult);
        setSyncProgress({
          phase: "adding product to catalog",
          count: count + 1,
          total: syncNewProductList.length,
        });
        count += 1;
      }
    }
    if (syncRemovedProductList.length > 0) {
      let count = 0;
      for (const item of syncRemovedProductList) {
        const resUpdateProduct = await upddatingProducts(item, catalogId, "remove");
        tempSyncResult.push(resUpdateProduct);
        setSyncResult(tempSyncResult);
        setSyncProgress({
          phase: "removing product from catalog",
          count: count + 1,
          total: syncRemovedProductList.length,
        });
        count += 1;
      }
    }
    return "success";
  };

  const upddatingProducts = async (item, catalogId, type) => {
    const resUpdateMetafield = await UpdateProductMetafield({
      productId: item.node.id,
      catalogId: catalogId,
      shopifyCatalog: item.node.shopifyCatalog,
      type,
    });
    if (
      !resUpdateMetafield ||
      resUpdateMetafield.updateMetafield.data.productUpdate.userErrors.length > 0
    ) {
      return {
        type,
        prodID: item.node.id,
        status: "error",
      };
    } else {
      return {
        type,
        prodID: item.node.id,
        status: "success",
      };
    }
  };

  const handleMongoCatalog = async (getSyncData) => {
    let resMongo = false;
    if (mongoCatalog.data.length > 0) {
      resMongo = await UpdateCatalog({
        shopifyCatalog: getSyncData.newData,
        monoCatalogId: mongoCatalog.data[0]._id,
      });
    } else {
      resMongo = await CreateCatalog({
        shopifyCatalog: getSyncData.newData,
        catalogName: shopifyCatalog?.newData.data.catalog.title,
        session,
        catalogId,
      });
      console.log("resMongo", resMongo);
    }
    if (!resMongo) {
      setSyncStatus({ createMongoCatalog: "error", getProducts: "error", syncProducts: "no" });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (syncProgress.count > 0) {
      const progressSync = (syncResult.length / syncCount) * 100;
      const successSync = syncResult.filter((item) => item.status === "success").length;
      const errorSync = syncResult.filter((item) => item.status === "error").length;
      setSyncMessage({
        progress: progressSync,
        success: successSync,
        error: errorSync,
      });
    }
  }, [syncResult, syncProgress, syncCount]);

  return (
    <Card>
      <CardContent>
        <Stack spacing={1} direction={"column"} alignItems={"center"} justifyContent={"center"}>
          {(syncStatus.getProducts === "error" ||
            syncStatus.syncProducts === "error" ||
            syncStatus.createMongoCatalog === "error") && (
            <Typography variant="subtitle1">Error sync data!</Typography>
          )}
          {syncStatus.getProducts === "progress" && (
            <>
              <Typography variant="subtitle1">Getting sync data</Typography>
              <CircularProgress />
            </>
          )}
          {syncStatus.syncProducts === "progress" && (
            <Box>
              <Typography variant="subtitle1">
                Sync was on progress please do not close the window!!!
              </Typography>
              <LinearProgress
                variant="determinate"
                value={syncMessage.progress}
                sx={{ mt: 1, mb: 1 }}
              />
              <Typography variant="body2">
                Phase : {syncProgress.phase} {syncProgress.count}/{syncProgress.total}
              </Typography>
              <Typography variant="body2">Succes product sync : {syncMessage.success}</Typography>
              <Typography variant="body2">Error product sync : {syncMessage.error}</Typography>
            </Box>
          )}
          {syncStatus.createMongoCatalog === "progress" && (
            <>
              <Typography variant="subtitle1">Creating Catalog at app!</Typography>
              <CircularProgress />
            </>
          )}
          {syncStatus.createMongoCatalog === "done" && (
            <Box>
              <Typography variant="subtitle1">All data has been synced!</Typography>
              <CsvDownloadButton
                data={syncResult}
                filename={`${shopifyCatalog.newData.data.catalog.title}.csv`}
              />
              <br />
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => {
                  mongoCatalogmutate();
                  setOnSync(false);
                }}
              >
                Continue to catalog detail
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CatalogSync;
