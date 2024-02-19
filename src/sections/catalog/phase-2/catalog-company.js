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
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AlertDialog from "src/components/alert-dialog";
import { ImageComponent } from "src/components/image";

import { catalogCompany } from "src/data/tableList";
import { positions } from "@mui/system";

const CatalogPriceRule = (props) => {
  const { catalog, session } = props;

  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editCompany, setEditcompany] = useState(false);
  const [companyList, setCompanyList] = useState(catalog.companies);
  const [companyListTotal, setCompanyListTotal] = useState(catalog.companies?.length);

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
    if (id) {
      queryJSON.catalogID = id;
    }
    const resGetCompanyList = await Promise.resolve(
      GetCompanies({
        page: page,
        postPerPage: rowsPerPage,
        query: queryJSON,
      })
    );
    if (!resGetCompanyList) {
      console.log("error get company data!");
      return;
    }
    console.log("resGetCompanyList", resGetCompanyList);
    setCompanyList(resGetCompanyList.data.company);
    setCompanyListTotal(resGetCompanyList.data.count);
    setSaveLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editCompany) {
      handleGetCompanies();
    } else {
      handleGetCompanies(catalog._id);
      setPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editCompany, page]);

  const handleSelectCompany = async (company, e) => {
    setSaveLoading(true);
    const resUpdateCompanyCatalog = await UpdateCompanyCatalog({
      companyID: company._id,
      catalogID: catalog._id,
      selected:e.target.checked
    });
    if (!resUpdateCompanyCatalog) {
      console.log("error");
    }
    
    await handleGetCompanies();
    setSaveLoading(false);
  };
console.log("companyList", companyList)
  return (
    <Card sx={{ mb: 2 }}>
      <Grid container justify="flex-end" alignItems="center">
        <Grid xs={6} md={6}>
          <CardHeader subheader={`Included ${catalog.companyCount} companies`} title="Company" />
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
                      const defaultContact = item.contact.find((cnt) => cnt.default === true);
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
                                  checked={item.catalogID === catalog._id}
                                />
                              ) : (
                                <Typography>{numberItem}</Typography>
                              )}
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{defaultContact.detail.email}</TableCell>
                            <TableCell>
                              {item.location.address} {item.location.city} {item.location.state},{" "}
                              {item.location.zip}
                            </TableCell>
                            <TableCell>{item.catalogID ? "#"+item.catalogID?.slice(-4) : "-"}</TableCell>
                            <TableCell>{item.sales.name}</TableCell>
                          </TableRow>
                        </Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={catalog.company ? catalog.company.length : 0}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 20]}
              />
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
