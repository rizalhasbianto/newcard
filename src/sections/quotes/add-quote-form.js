import { useCallback, useState, useEffect } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Unstable_Grid2 as Grid
} from '@mui/material';

import { SearchProduct } from './quotes-search-product'
import QuoteSelectCompany from './quote-select-company'
import AddCompany from '../companies/company-add'
import LineItemQuotes from './quotes-selected-products'
import { saveQuoteButton } from 'src/data/save-quote-button'

import { useToast } from 'src/hooks/use-toast'
import Toast from 'src/components/toast'
import { 
  saveQuoteToMongoDb, 
  updateOrderIdQuoteToMongoDb, 
  getCompanies 
} from 'src/service/use-mongo'
import { syncQuoteToShopify, sendDraftOrderByShopify } from 'src/service/use-shopify'

export const QuotesForm = (props) => {
  const { tabContent } = props
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [shipTo, setShipTo] = useState("");
  const [shipToList, setShipToList] = useState([]);
  const [location, setLocation] = useState();
  const [quotesList, setQuotesList] = useState([]);
  const [buttonloading, setButtonLoading] = useState();
  const [addNewCompany, setAddNewCompany] = useState(false);
  const [refreshList, setRefreshList] = useState(0);
  const toastUp = useToast();

  const handleTemplate = useCallback(
    () => {
      setButtonLoading()
      toastUp.handleStatus("success")
      toastUp.handleMessage("Line item saved to template!!!")
    }, [toastUp]
  )

  const handleDraft = useCallback(
    async () => {
      const mongoReponse = await saveQuoteToMongoDb(companyName, shipTo, quotesList, "draft")
      if (!mongoReponse) { // error when save data to mongo
        toastUp.handleStatus("error")
        toastUp.handleMessage("Error save to DB!")
        setButtonLoading(false)
        return
      }
      setButtonLoading()
      toastUp.handleStatus("success")
      toastUp.handleMessage("Quote saved as draft!!!")
    }, [companyName, quotesList, shipTo, toastUp]
  )

  const handlePublish = useCallback(
    async (status) => {
      const mongoReponse = await saveQuoteToMongoDb(companyName, shipTo, quotesList, "open")
      if (!mongoReponse) { // error when save data to mongo
        toastUp.handleStatus("error")
        toastUp.handleMessage("Error save to DB!")
        setButtonLoading(false)
        return
      }

      const shopifyResponse = await syncQuoteToShopify(mongoReponse, quotesList, status)
      if (!shopifyResponse || shopifyResponse.createDraft.errors) { // error when sync data to shopify
        toastUp.handleStatus("warning")
        toastUp.handleMessage("Error sync to Shopify! saved as Draft")
        setButtonLoading()
        return
      }

      const quoteId = mongoReponse?.data.insertedId;
      const draftOrderId = shopifyResponse.createDraft.data.draftOrderCreate.draftOrder.id
      const updateQuoteAtMongo = await updateOrderIdQuoteToMongoDb(quoteId, draftOrderId)
      if (updateQuoteAtMongo.modifiedCount === 0) { // error when update data to mongo
        toastUp.handleStatus("error")
        toastUp.handleMessage("Error save to DB! please try publish again")
        setButtonLoading(false)
        return
      }

      setButtonLoading()
      toastUp.handleStatus("success")
      toastUp.handleMessage("Quote has been published!!!")
    }, [companyName, quotesList, shipTo, toastUp]
  )

  const handleInvoice = useCallback(
    async (status) => {
      const mongoReponse = await saveQuoteToMongoDb(companyName, shipTo, quotesList, "sent invoice")
      if (!mongoReponse) { // error when save data to mongo
        toastUp.handleStatus("error")
        toastUp.handleMessage("Error save to DB!")
        setButtonLoading(false)
        return
      }

      const shopifyResponse = await syncQuoteToShopify(mongoReponse, quotesList, status)
      if (!shopifyResponse || shopifyResponse.createDraft.errors) { // error when sync data to shopify
        toastUp.handleStatus("warning")
        toastUp.handleMessage("Error sync to Shopify! saved as Draft")
        setButtonLoading()
        return
      }
      const quoteId = mongoReponse?.data.insertedId;
      const draftOrderId = shopifyResponse.createDraft.data.draftOrderCreate.draftOrder.id
      const updateQuoteAtMongo = await updateOrderIdQuoteToMongoDb(quoteId, draftOrderId)
      if (!updateQuoteAtMongo) { // error when update data to mongo
        toastUp.handleStatus("error")
        toastUp.handleMessage("Error save to DB! please try publish again")
        setButtonLoading(false)
        return
      }

      const sendInvoice = await sendDraftOrderByShopify("rizalhasbianto@gmail.com", draftOrderId)
      if (!sendInvoice || sendInvoice.sendDraft.errors) { // error when send invoice
        toastUp.handleStatus("error")
        toastUp.handleMessage("Error send invoice! quote saved as open")
        setButtonLoading(false)
        return
      }

      setButtonLoading()
      toastUp.handleStatus("success")
      toastUp.handleMessage("Invoice sent!!!")
    }, [companyName, quotesList, shipTo, toastUp]
  )

  const handleSubmit = useCallback(
    (type) => {
      setButtonLoading(type)
      if (type === "template") {
        handleTemplate()
      }
      if (type === "draft") {
        handleDraft()
      }
      if (type === "publish") {
        handlePublish()
      }
      if (type === "invoice") {
        handleInvoice()
      }
    }, [handleDraft, handleInvoice, handlePublish, handleTemplate]
  )

  const getCompaniesData = useCallback(async(page, rowsPerPage) => {
    const companyList = await getCompanies(page, rowsPerPage)
    if (!companyList) {
      console.log("error get quotes data!")
      return
    }
    setCompanies(companyList.data.company)
  },[])

  useEffect(() => {
    getCompaniesData(0, 50)
  }, [getCompaniesData, refreshList]); 

  useEffect(() => {
    if(tabContent) {
      setCompanyName(tabContent.company.name)
      setShipTo(tabContent.company.shipTo)
      setQuotesList(tabContent.quotesList)
    }
  }, [tabContent]); 

  return (
    <>
      <Toast
        toastStatus={toastUp.toastStatus}
        handleStatus={toastUp.handleStatus}
        toastMessage={toastUp.toastMessage}
      />
      <Card sx={{ mb: 2 }}>
        <Grid
          container
          justify="flex-end"
          alignItems="center"
        >
          <Grid
            xs={6}
            md={6}
            sx={{
              padding: 0
            }}
          >
            <CardHeader
              subheader="Please choose a company"
              title="Company Options"
            />
          </Grid>
          <Grid
            xs={6}
            md={6}
            sx={{
              textAlign: "right",
              paddingRight: "25px"
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setAddNewCompany(true)}
            >
              Add New Company
            </Button>
          </Grid>
        </Grid>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            {addNewCompany ?
              <AddCompany
                setAddNewCompany={setAddNewCompany}
                toastUp={toastUp}
                setShipToList={setShipToList}
                setLocation={setLocation}
                setShipTo={setShipTo}
                setCompanyName={setCompanyName}
                setRefreshList={setRefreshList}
                refreshList={refreshList}
              />
              :

              <QuoteSelectCompany
                companies={companies}
                location={location}
                shipToList={shipToList}
                shipTo={shipTo}
                companyName={companyName}
                setShipToList={setShipToList}
                setLocation={setLocation}
                setShipTo={setShipTo}
                setCompanyName={setCompanyName}
              />
            }

          </Box>
        </CardContent>
      </Card>
      {companyName &&
        <Card sx={{ mb: 2 }}>
          <CardHeader
            subheader="The information can be edited"
            title="Add quotes Item"
          />
          <CardContent sx={{ pt: 0, pb: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <SearchProduct
                quotesList={quotesList}
                setQuotesList={setQuotesList}
              />
            </Box>
          </CardContent>
        </Card>
      }
      {companyName && quotesList.length > 0 &&
        <Card>
          <CardHeader
            subheader="The information can be edited"
            title="Selected Products"
          />
          <CardContent sx={{ pt: 0 }}>
            <LineItemQuotes
              quotesList={quotesList}
              setQuotesList={setQuotesList}
            />
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            {
              saveQuoteButton.map((button) => {
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
                )
              })
            }
          </CardActions>
        </Card>
      }
    </>
  );
};
