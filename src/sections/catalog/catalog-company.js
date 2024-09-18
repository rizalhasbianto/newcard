import { useState, useCallback, Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { CreateCatalog } from "src/service/use-mongo";
import { format } from "date-fns-tz";
import { GetCompanies, UpdateCompanyCatalog } from "src/service/use-mongo";

import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  TableContainer,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Typography,
  Stack,
  SvgIcon,
  Skeleton,
  Unstable_Grid2 as Grid,
  CardHeader,
  Button,
  CircularProgress,
  Backdrop,
  Checkbox,
  Tooltip,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AlertDialog from "src/components/alert-dialog";
import { ImageComponent } from "src/components/image";

import { catalogCompany } from "src/data/tableList";
import { positions } from "@mui/system";

const CatalogPriceRule = (props) => {
  const { mongoCatalog, shopifyCatalog, session, shopifyCatalogmutate, toastUp } = props;
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [editCompany, setEditcompany] = useState(false);
  const [companyList, setCompanyList] = useState(shopifyCatalog.companyLocations.edges);
  const [companyListTotal, setCompanyListTotal] = useState(shopifyCatalog.companyLocationsCount);

  const handlePageChange = useCallback(async (event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback(async (event) => {
    setPage(0);
    setRowsPerPage(event.target.value);
  }, []);

  const companyQuery = (role) => {
    switch (role) {
      case "customer":
        return {};
      case "sales":
        return { "sales.name": session.user.name };
      default:
        return {};
    }
  };

  const handleGetCompanies = useCallback(async (id) => {
    setSaveLoading(true);
    const queryJSON = companyQuery(session.user.detail.role);

    const resGetCompanyList = await GetCompanies({
      page: page,
      postPerPage: rowsPerPage,
      query: queryJSON,
    });

    if (!resGetCompanyList) {
      console.log("error get company data!");
      return;
    }

    const companyData = [];
    resGetCompanyList.data.company.forEach((item) => {
      const defaultContact = item.contacts.find((dt) => dt.default === true);
      const dataCompany = {
        node: {
          id: item.shopifyCompanyLocationId,
          billingAddress: {
            address1: item.location.address,
            city: item.location.city,
            province: item.location.state,
            zip: item.location.zip,
          },
          mongoCompany: {
            id: item._id,
            sales: item.sales,
          },
          company: {
            id: item.shopifyCompanyId,
            name: item.name,
            mainContact: {
              customer: {
                displayName: defaultContact?.detail?.name,
                email: defaultContact?.detail?.email,
              },
            },
          },
        },
      };
      companyData.push(dataCompany);
    });

    setCompanyList(companyData);
    setCompanyListTotal(resGetCompanyList.data.count);
    setSaveLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editCompany) {
      handleGetCompanies();
    } else {
      setCompanyList(shopifyCatalog.companyLocations.edges);
      setPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editCompany, page]);

  const handleSelectCompany = async (company, e) => {
    setSaveLoading(true);

    const resUpdateCompanyCatalog = await UpdateCompanyCatalog({
      catalogID: shopifyCatalog.id,
      catalogList: shopifyCatalog.companyLocations.edges,
      companyLocationID: company.node.id,
      mongoCompanyID: company.node.mongoCompany.id,
      selected: e.target.checked,
    });
    if (!resUpdateCompanyCatalog) {
      toastUp.handleStatus("error");
      toastUp.handleMessage("Error sync company to catalog");
      setSaveLoading(false);
      return;
    }
    if (resUpdateCompanyCatalog?.data?.data?.catalogUpdate?.userErrors.length > 0) {
      toastUp.handleStatus("error");
      toastUp.handleMessage(
        resUpdateCompanyCatalog?.data?.data?.catalogUpdate?.userErrors[0].message
      );
      setSaveLoading(false);
      return;
    }

    shopifyCatalogmutate();
    setSaveLoading(false);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <Grid container justify="flex-end" alignItems="center">
        <Grid xs={6} md={6}>
          <CardHeader subheader={`Included ${companyListTotal} companies`} title="Company" />
        </Grid>
        <Grid
          xs={6}
          md={6}
          sx={{
            textAlign: "right",
            paddingRight: "25px",
          }}
        >
          <LoadingButton
            color="primary"
            onClick={() => setEditcompany(!editCompany)}
            loading={false}
            loadingPosition="start"
            startIcon={editCompany ? <CloseIcon /> : <EditIcon />}
            variant="outlined"
          >
            {editCompany ? "Done" : "Edit"}
          </LoadingButton>
        </Grid>
      </Grid>

      <CardContent sx={{ pt: 0 }}>
        <Grid lg={12} sx={{ mt: 2, position: "relative" }}>
          {companyList && companyList.length > 0 ? (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"></TableCell>
                      {catalogCompany.map((head) => {
                        return (
                          <TableCell
                            key={head.title}
                            sx={{
                              textAlign: "left",
                            }}
                          >
                            {head.title}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ maxHeight: "500px" }}>
                    {companyList.map((item, i) => {
                      const numberItem = page * rowsPerPage + i + 1;
                      const matchId = shopifyCatalog.companyLocations.edges.findIndex(
                        (itm) =>
                          itm.node.id.replace("gid://shopify/CompanyLocation/", "") === item.node.id
                      );

                      return (
                        <Fragment key={i + 1}>
                          <Backdrop
                            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={saveLoading}
                          >
                            <CircularProgress color="inherit" />
                          </Backdrop>
                          <TableRow sx={{ position: "relative" }}>
                            <TableCell padding="checkbox">
                              {editCompany ? (
                                <Checkbox
                                  onChange={(e) => handleSelectCompany(item, e)}
                                  checked={matchId >= 0 ? true : false}
                                />
                              ) : (
                                <Typography>{numberItem}</Typography>
                              )}
                            </TableCell>
                            <TableCell>{item.node.company.name}</TableCell>
                            <TableCell>
                              {item.node.company.mainContact
                                ? item.node.company.mainContact?.customer.displayName +
                                  "(" +
                                  item.node.company.mainContact.customer.email +
                                  ")"
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {item.node.billingAddress
                                ? `${item.node.billingAddress.address1} ${item.node.billingAddress.city} ${item.node.billingAddress.province}, 
                                ${item.node.billingAddress.zip}`
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {item.node?.catalogs?.edges.length > 0 ? (
                                <Stack display={"flex"} direction={"row"} alignItems={"top"}>
                                  <Typography>{item.node?.catalogs.edges.length}</Typography>
                                  <Tooltip
                                    title={item.node?.catalogs?.edges.map((catalog) => {
                                      return (
                                        <>
                                          <Typography>{catalog.node.title}</Typography>
                                        </>
                                      );
                                    })}
                                    placement="right"
                                    arrow="true"
                                  >
                                    <InfoOutlinedIcon fontSize="17px" color="success" />
                                  </Tooltip>
                                </Stack>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {item.node.mongoCompany.sales
                                ? item.node.mongoCompany.sales.name
                                : "-"}
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* <TablePagination
                component="div"
                count={catalog.company ? catalog.company.length : 0}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 20]}
              /> */}
            </>
          ) : (
            <Stack spacing={1} direction={"row"} alignItems={"center"} justifyContent={"center"}>
              <Typography variant="subtitle1">No company selected</Typography>
              <LoadingButton
                color="primary"
                //onClick={handleAddQuote}
                loading={false}
                loadingPosition="start"
                startIcon={<AddIcon />}
                variant="outlined"
              >
                Add
              </LoadingButton>
            </Stack>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CatalogPriceRule;
