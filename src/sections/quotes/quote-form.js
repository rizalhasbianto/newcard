import { useCallback, useState, useEffect } from "react";
import { format } from "date-fns-tz";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
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
  TextField,
  Stack,
} from "@mui/material"; 

import { SelectProducts } from "./add-products";
import QuoteSelectCompany from "./quote-select-company";
import AddCompany from "../companies/company-add";
import LineItemQuotes from "./quotes-line-item";
import { saveQuoteButton } from "src/data/save-quote-button";
import SaveWarning from "src/components/save-warning";

import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";
import {
  SaveQuoteToMongoDb,
  UpdateOrderIdQuoteToMongoDb,
  GetCompanies,
  SendInvoice,
  SaveCollectionToMongoDb,
} from "src/service/use-mongo";
import { SyncQuoteToShopify, GetProductVariantsShopify } from "src/service/use-shopify";

const QuotesForm = (props) => {
  const { tabContent, reqQuotesData, tabIndex, session } = props;

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [shipToList, setShipToList] = useState([]);
  const [shipTo, setShipTo] = useState();
  const [quotesList, setQuotesList] = useState([]);
  const [buttonloading, setButtonLoading] = useState();
  const [addNewCompany, setAddNewCompany] = useState(false);
  const [quoteId, setQuoteId] = useState();
  const [discount, setDiscount] = useState();
  const [payment, setPayment] = useState(tabContent.payment);
  const [newCollection, setNewCollection] = useState(false);
  const [collectionName, setCollectionName] = useState();
  const [total, setTotal] = useState();
  const toastUp = useToast();

  const handleSubmit = useCallback(
    async (props) => { 
      const {
        type = "draft",
        company = selectedCompany,
        shipToAddress = shipTo,
        quotesListData = quotesList,
        finalDiscount = discount,
        selectedQuoteId = quoteId,
        selectedPayment = payment,
        currentTabContent = tabContent
      } = props;
      setButtonLoading(type);
      const mongoReponse = await SaveQuoteToMongoDb(
        company,
        shipToAddress,
        quotesListData,
        finalDiscount,
        type,
        selectedQuoteId,
        selectedPayment
      );
      if (!mongoReponse) {
        // error when save data to mongo
        toastUp.handleStatus("error");
        toastUp.handleMessage("Error save to DB!");
        setButtonLoading(false);
        return;
      }

      if (type === "draft") {
        const draftMessage = type === currentTabContent.status ? "Quote updated!!!" : "Quote saved as draft!!!"
        toastUp.handleStatus("success");
        toastUp.handleMessage(draftMessage);
        reqQuotesData(0, 50, tabIndex);
        setButtonLoading(false);
        return;
      }

      const defaultContact = company.contact.find((itm) => itm.default);
      const companyBill = {
        name: company.name,
        contact: defaultContact,
        location: shipToAddress,
      };

      const shopifyResponse = await SyncQuoteToShopify(
        selectedQuoteId,
        quotesListData,
        companyBill,
        finalDiscount,
        selectedPayment,
        currentTabContent.draftOrderId
      );

      if (
        !shopifyResponse ||
        shopifyResponse.response?.createDraft?.errors ||
        !shopifyResponse.response
      ) {
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

      const checkoutUrl = {
        url:
          shopifyResponse.operation === "create"
            ? shopifyResponse.response.createDraft.data.draftOrderCreate.draftOrder.invoiceUrl
            : shopifyResponse.response.createDraft.data.draftOrderUpdate.draftOrder.invoiceUrl,
      };

      const updateQuoteAtMongoRes = await UpdateOrderIdQuoteToMongoDb(
        selectedQuoteId,
        draftOrderId,
        checkoutUrl
      );

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

      const quoteDataInvoice = {
        name: companyContact.name,
        email: companyContact.email,
        companyName: companyName,
        orderNumber: draftOrderId.name,
        poNumber: "#" + selectedQuoteId,
        checkoutUrl: checkoutUrl.url,
        quoteId: selectedQuoteId,
      };
      const sendInvoiceRes = await SendInvoice(quoteDataInvoice);
      if (!sendInvoiceRes) {
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
    },

   
    [selectedCompany, shipTo, quotesList, discount, quoteId, payment, tabContent, reqQuotesData, toastUp, tabIndex]
  );

  const companyQuery = (role) => {
    switch (role) {
      case "customer":
        return { id: session.user.detail.company.companyId };
      case "sales":
        return { "sales.name": session.user.name };
      default:
        return;
    }
  };

  const GetCompaniesData = useCallback(
    async (page, rowsPerPage) => {
      console.log("compaies get run", selectedCompany)
      let companyList;
      let updatedVariantData
      if (companies.length === 0) {
        const resGetCompanyList = await Promise.resolve(
          GetCompanies({
            page: page,
            postPerPage: rowsPerPage,
            query: companyQuery(session.user.detail.role),
          })
        );
        if (!resGetCompanyList) {
          console.log("error get company data!");
          return;
        }
        companyList = resGetCompanyList.data.company;
        setCompanies(companyList);
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

          if(tabContent.quotesList && tabContent.quotesList.length > 0) {
            console.log("tabContent.quotesList", tabContent.quotesList)
  
            const variantIDs = tabContent.quotesList.map((itm) => itm.variant.id)
            console.log("variantIDs", variantIDs)
            const variantUpdated = await GetProductVariantsShopify({variantIDs, shopifyCompanyLocationID:selectedCompany.shopifyCompanyLocationId})
            console.log("variantUpdated", variantUpdated)
            tabContent.quotesList.forEach((itm) => {
              //const variant = itm.variant
              const findVariant = variantUpdated.newData.data.nodes.find((variant) => variant.id === itm.variant.id);
              console.log("findVariant", findVariant)
              itm.variant.price.amount = findVariant.price
              itm.variant.currentlyNotInStock = findVariant.inventoryQuantity > 0 ? false : true
              itm.variant.quantityAvailable = findVariant.inventoryQuantity
              itm.variant.companyPrice.node[`company_${selectedCompany.shopifyCompanyLocationId}`] = findVariant[`company_${selectedCompany.shopifyCompanyLocationId}`]
            })
            console.log("variantUpdated", variantUpdated)
          }

          setSelectedCompany(selectedCompany);
          setShipToList(selectedCompany?.shipTo);
          setShipTo(selectedLocation);
          setQuotesList(tabContent.quotesList);
        } else {
          setShipToList([]);
          setShipTo();
          setSelectedCompany();
        }

        setQuoteId(tabContent._id);
        setDiscount(tabContent.discount);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companies, tabContent]
  );

  const handleSaveCollection = useCallback(async () => {
    let error = true;
    if (collectionName) {
      const resSaveCollection = await SaveCollectionToMongoDb(collectionName, quotesList);
      if (resSaveCollection && resSaveCollection.data.insertedId !== "error") {
        toastUp.handleStatus("success");
        toastUp.handleMessage("Collection saved!!!");
        setNewCollection(false);
        error = false;
        return true;
      }
    }

    toastUp.handleStatus("error");
    toastUp.handleMessage("Failed save collection!!!");
  }, [collectionName, quotesList, toastUp]);

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
      <SaveWarning unsavedChanges={false} />
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
              <Typography variant="body2">
                Created By: {tabContent?.createdBy.name} /{" "}
                {tabContent?.createdBy.role === "customer"
                  ? tabContent?.createdBy.company
                  : tabContent?.createdBy.role}
              </Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography variant="body2">
                LastUpdate: {format(new Date(tabContent?.updatedAt), "MM-dd-yyyy")}
              </Typography>
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
            {(session.user.detail.role === "admin" || session.user.detail.role === "sales") && (
              <Button variant="outlined" onClick={() => setAddNewCompany(true)}>
                Add New Company
              </Button>
            )}
          </Grid>
        </Grid>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Collapse in={!addNewCompany}>
              <QuoteSelectCompany
                companies={companies}
                shipToList={shipToList}
                shipTo={shipTo}
                setShipToList={setShipToList}
                setShipTo={setShipTo}
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                quotesList={quotesList}
                setQuotesList={setQuotesList}
                handleSubmit={handleSubmit}
              />
            </Collapse>
            <Collapse in={addNewCompany}></Collapse>
          </Box>
        </CardContent>
      </Card>
      <Collapse in={selectedCompany ? true : false}>
        <Card sx={{ mb: 2 }}>
          <CardHeader subheader="Product search" title="Add products" />
          <CardContent sx={{ pt: 0, pb: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <SelectProducts
                quotesList={quotesList}
                setQuotesList={setQuotesList}
                quoteId={quoteId}
                selectedCompany={selectedCompany}
                session={session}
                handleSubmit={handleSubmit}
              />
            </Box>
          </CardContent>
        </Card>
      </Collapse>
      <Collapse in={selectedCompany && quotesList.length > 0 ? true : false}>
        <Card>
          <Grid container justify="flex-end" alignItems="center">
            <Grid xs={6} md={6}>
              <CardHeader
                subheader={`${quotesList.length} item's (${total?.countQty}Qty) at $${total?.subTotal}`}
                title="Selected Products"
              />
            </Grid>
            <Grid
              xs={6}
              md={6}
              sx={{
                textAlign: "right",
                paddingRight: "25px",
              }}
            >
              <Collapse in={newCollection}>
                <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
                  <TextField
                    id="collection-name"
                    name="collectionName"
                    label="Collection Name"
                    variant="outlined"
                    value={collectionName}
                    onInput={(e) => setCollectionName(e.target.value)}
                  />
                  <LoadingButton
                    color="primary"
                    onClick={handleSaveCollection}
                    loading={false}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="contained"
                  >
                    Save
                  </LoadingButton>
                  <LoadingButton
                    color="primary"
                    loading={false}
                    loadingPosition="start"
                    startIcon={<ClearIcon />}
                    variant="contained"
                    onClick={() => setNewCollection(false)}
                  >
                    Cancel
                  </LoadingButton>
                </Stack>
              </Collapse>
              <Collapse in={!newCollection}>
                <Button variant="outlined" onClick={() => setNewCollection(true)}>
                  Save products as collection
                </Button>
              </Collapse>
            </Grid>
          </Grid>
          <CardContent sx={{ pt: 0 }}>
            <LineItemQuotes
              quotesList={quotesList}
              setQuotesList={setQuotesList}
              discount={discount}
              setDiscount={setDiscount}
              payment={payment}
              setPayment={setPayment}
              total={total}
              setTotal={setTotal}
              shopifyCompanyLocationID={selectedCompany?.shopifyCompanyLocationId}
            />
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "space-between", padding: "20px" }}>
            <Typography variant="body1">Current Status: {tabContent?.status}</Typography>
            <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
              {saveQuoteButton.map((button) => {
                return (
                  <LoadingButton
                    color="primary"
                    onClick={() => handleSubmit({type:button.action})}
                    loading={buttonloading === button.action ? true : false}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="contained"
                    key={button.action}
                  >
                    {button.action === tabContent?.status && button.action !== "invoiced"
                      ? "Save"
                      : button.title}
                  </LoadingButton>
                );
              })}
            </Stack>
          </CardActions>
        </Card>
      </Collapse>
    </>
  );
};

export default QuotesForm;
