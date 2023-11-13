import { useCallback, useState, useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Collapse,
  Unstable_Grid2 as Grid,
  Typography,
} from "@mui/material";

import { SelectProducts } from "./add-products";
import QuoteSelectCompany from "./quote-select-company";
import AddCompany from "../companies/company-add";
import LineItemQuotes from "./quotes-line-item";
import { saveQuoteButton } from "src/data/save-quote-button";

import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";
import {
  SaveQuoteToMongoDb,
  UpdateOrderIdQuoteToMongoDb,
  GetCompanies,
} from "src/service/use-mongo";
import { SyncQuoteToShopify, SendInvoiceByShopify } from "src/service/use-shopify";

export const QuotesForm = (props) => {
  const { tabContent, reqQuotesData } = props;
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [shipTo, setShipTo] = useState("");
  const [shipToList, setShipToList] = useState([]);
  const [companyContact, setCompanyContact] = useState([]);
  const [location, setLocation] = useState();
  const [quotesList, setQuotesList] = useState([]);
  const [buttonloading, setButtonLoading] = useState();
  const [addNewCompany, setAddNewCompany] = useState(false);
  const [quoteId, setQuoteId] = useState();
  const [discount, setDiscount] = useState();
  const [payment, setPayment] = useState();
  const toastUp = useToast();

  const handleTemplate = useCallback(() => {
    setButtonLoading();
    toastUp.handleStatus("success");
    toastUp.handleMessage("Line item saved to template!!!");
  }, [toastUp]);

  const handleSubmit = useCallback(
    async (type) => {
      setButtonLoading(type);
      if (type === "template") {
        handleTemplate();
        return;
      }

      const mongoReponse = await SaveQuoteToMongoDb(
        companyName,
        shipTo,
        quotesList,
        discount,
        type,
        quoteId
      );
      if (!mongoReponse) {
        // error when save data to mongo
        toastUp.handleStatus("error");
        toastUp.handleMessage("Error save to DB!");
        setButtonLoading(false);
        return;
      }

      if (type === "draft") {
        toastUp.handleStatus("success");
        toastUp.handleMessage("Quote saved as draft!!!");
        reqQuotesData(0, 50);
        setButtonLoading(false);
        return;
      }

      const companyBill = {
        name: companyName,
        contact: companyContact,
        location: location,
      };

      const shopifyResponse = await SyncQuoteToShopify(
        quoteId,
        quotesList,
        companyBill,
        discount,
        tabContent.draftOrderId
      );
      if (!shopifyResponse || shopifyResponse.response.createDraft.errors) {
        // error when sync data to shopify
        toastUp.handleStatus("warning");
        toastUp.handleMessage("Error sync to Shopify!");
        setButtonLoading();
        return;
      }

      const draftOrderId = {
        id:
          shopifyResponse.operation === "create"
            ? shopifyResponse.response.createDraft.data.draftOrderCreate.draftOrder.id
            : shopifyResponse.response.createDraft.data.draftOrderUpdate.draftOrder.id,
        name:
          shopifyResponse.operation === "create"
            ? shopifyResponse.response.createDraft.data.draftOrderCreate.draftOrder.name
            : shopifyResponse.response.createDraft.data.draftOrderUpdate.draftOrder.name,
      };

      const updateQuoteAtMongoRes = await UpdateOrderIdQuoteToMongoDb(quoteId, draftOrderId);

      if (!updateQuoteAtMongoRes || updateQuoteAtMongoRes.modifiedCount === 0) {
        // error when update data to mongo
        toastUp.handleStatus("error");
        toastUp.handleMessage("Error save to DB! please try publish again");
        setButtonLoading(false);
        return;
      }

      if (type === "open") {
        toastUp.handleStatus("success");
        toastUp.handleMessage("Quote has been published!!!");
        reqQuotesData(0, 50);
        setButtonLoading(false);
        return;
      }

      const sendInvoiceRes = await SendInvoiceByShopify(draftOrderId.id);
      if (!sendInvoiceRes || sendInvoiceRes.sendDraft.errors) {
        // error when send invoice
        toastUp.handleStatus("error");
        toastUp.handleMessage("Error send invoice! quote saved as open");
        setButtonLoading(false);
        return;
      }

      reqQuotesData(0, 50);
      setButtonLoading();
      toastUp.handleStatus("success");
      toastUp.handleMessage("Invoice sent!!!");

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      companyContact,
      companyName,
      discount,
      handleTemplate,
      location,
      quoteId,
      quotesList,
      reqQuotesData,
      shipTo,
      tabContent.draftOrderId,
      toastUp,
    ]
  );

  const GetCompaniesData = useCallback(
    async (page, rowsPerPage) => {
      let companyList;
      if (companies.length === 0) {
        const resGetCompanyList = await Promise.resolve(GetCompanies(page, rowsPerPage));
        if (!resGetCompanyList) {
          console.log("error get company data!");
          return;
        }
        companyList = resGetCompanyList.data.company;
        setCompanies(resGetCompanyList.data.company);
      } else {
        companyList = companies;
      }

      if (tabContent) {
        if (tabContent.company.name) {
          const selectedCompany = companyList.find(
            (company) => company.name === tabContent.company.name
          );
          const selectedLocation = selectedCompany?.shipTo.find(
            (ship) => ship.locationName === tabContent.company.shipTo
          );
          setShipToList(selectedCompany?.shipTo);
          setLocation(selectedLocation?.location);
          setCompanyContact(selectedCompany?.contact[0]);
        } else {
          setShipToList([]);
          setCompanyContact();
          setLocation();
        }

        setCompanyName(tabContent.company.name);
        setShipTo(tabContent.company.shipTo);
        setQuotesList(tabContent.quotesList);
        setQuoteId(tabContent._id);
        setDiscount(tabContent.discount);
      }
    },
    [companies, tabContent]
  );

  useEffect(() => {
    GetCompaniesData(0, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabContent]);

  return (
    <>
      <Toast
        toastStatus={toastUp.toastStatus}
        handleStatus={toastUp.handleStatus}
        toastMessage={toastUp.toastMessage}
      />
      {tabContent && tabContent.status !== "new" && tabContent.status !== "draft" && (
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
              <Typography variant="body2">status: {tabContent?.status}</Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography variant="body2">
                Shopify Order Id: {tabContent?.draftOrderNumber}
              </Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography variant="body2">Created By: Admin</Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography variant="body2">LastUpdate: {tabContent?.updatedAt}</Typography>
            </Grid>
          </Grid>
        </Card>
      )}

      <Card sx={{ mb: 2 }}>
        <Grid container justify="flex-end" alignItems="center">
          <Grid
            xs={6}
            md={6}
            sx={{
              padding: 0,
            }}
          >
            <CardHeader subheader="Please choose a company" title="Company Options" />
          </Grid>
          <Grid
            xs={6}
            md={6}
            sx={{
              textAlign: "right",
              paddingRight: "25px",
            }}
          >
            <Button variant="outlined" onClick={() => setAddNewCompany(true)}>
              Add New Company
            </Button>
          </Grid>
        </Grid>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Collapse in={!addNewCompany}>
              <QuoteSelectCompany
                companies={companies}
                location={location}
                shipToList={shipToList}
                shipTo={shipTo}
                companyName={companyName}
                companyContact={companyContact}
                setShipToList={setShipToList}
                setLocation={setLocation}
                setShipTo={setShipTo}
                setCompanyName={setCompanyName}
                setCompanyContact={setCompanyContact}
              />
            </Collapse>
            <Collapse in={addNewCompany}>
              <AddCompany
                setAddNewCompany={setAddNewCompany}
                toastUp={toastUp}
                getSelectedVal={true}
                setCompanies={setCompanies}
                setShipToList={setShipToList}
                setLocation={setLocation}
                setShipTo={setShipTo}
                setCompanyName={setCompanyName}
                GetCompanies={GetCompanies}
                setCompanyContact={setCompanyContact}
              />
            </Collapse>
          </Box>
        </CardContent>
      </Card>
      <Collapse in={companyName ? true : false}>
        <Card sx={{ mb: 2 }}>
          <CardHeader subheader="Product search" title="Add quotes Item" />
          <CardContent sx={{ pt: 0, pb: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <SelectProducts
                quotesList={quotesList}
                setQuotesList={setQuotesList}
                quoteId={quoteId}
              />
            </Box>
          </CardContent>
        </Card>
      </Collapse>
      <Collapse in={companyName && quotesList.length > 0 ? true : false}>
        <Card>
          <CardHeader subheader="" title="Selected Products" />
          <CardContent sx={{ pt: 0 }}>
            <LineItemQuotes
              quotesList={quotesList}
              setQuotesList={setQuotesList}
              discount={discount}
              setDiscount={setDiscount}
              payment={payment}
              setPayment={setPayment}
            />
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            {saveQuoteButton.map((button) => {
              return (
                <LoadingButton
                  color="primary"
                  onClick={() => handleSubmit(button.action)}
                  loading={buttonloading === button.action ? true : false}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  key={button.action}
                >
                  {button.title}
                </LoadingButton>
              );
            })}
          </CardActions>
        </Card>
      </Collapse>
    </>
  );
};
