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
  Collapse,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { SearchProduct } from './quotes-search-product'
import QuoteSelectCompany from './quote-select-company'
import AddCompany from '../companies/company-add'
import LineItemQuotes from './quotes-line-item'
import { saveQuoteButton } from 'src/data/save-quote-button'

import { useToast } from 'src/hooks/use-toast'
import Toast from 'src/components/toast'
import {
  saveQuoteToMongoDb,
  updateOrderIdQuoteToMongoDb,
  getCompanies
} from 'src/service/use-mongo'
import { syncQuoteToShopify, sendInvoiceByShopify } from 'src/service/use-shopify'

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
  const [refreshList, setRefreshList] = useState(0);
  const [quoteId, setQuoteId] = useState();
  const toastUp = useToast();

  const handleTemplate = useCallback(
    () => {
      setButtonLoading()
      toastUp.handleStatus("success")
      toastUp.handleMessage("Line item saved to template!!!")
    }, [toastUp]
  )

  const handleSubmit = useCallback(
    async (type) => {
      setButtonLoading(type)
      if (type === "template") {
        handleTemplate()
        return
      }

      const mongoReponse = await saveQuoteToMongoDb(companyName, shipTo, quotesList, type, quoteId)
      if (!mongoReponse) { // error when save data to mongo
        toastUp.handleStatus("error")
        toastUp.handleMessage("Error save to DB!")
        setButtonLoading(false)
      }

      reqQuotesData(0, 50)

      if (type === "draft") {
        toastUp.handleStatus("success")
        toastUp.handleMessage("Quote saved as draft!!!")
        setButtonLoading(false)
        return
      }

      const shopifyResponse = await syncQuoteToShopify(mongoReponse, quotesList)
      if (!shopifyResponse || shopifyResponse.createDraft.errors) { // error when sync data to shopify
        toastUp.handleStatus("warning")
        toastUp.handleMessage("Error sync to Shopify! saved as Draft")
        setButtonLoading()
        return
      }

      const draftOrderId = shopifyResponse.createDraft.data.draftOrderCreate.draftOrder.id
      const updateQuoteAtMongoRes = await updateOrderIdQuoteToMongoDb(quoteId, quoteId)
      if (!updateQuoteAtMongoRes || updateQuoteAtMongoRes.modifiedCount === 0) { // error when update data to mongo
        toastUp.handleStatus("error")
        toastUp.handleMessage("Error save to DB! please try publish again")
        setButtonLoading(false)
        return
      }

      if (type === "publish") {
        toastUp.handleStatus("success")
        toastUp.handleMessage("Quote has been published!!!")
        setButtonLoading(false)
        return
      }

      const sendInvoiceRes = await sendInvoiceByShopify("rizalhasbianto@gmail.com", draftOrderId)
      if (!sendInvoiceRes || sendInvoiceRes.sendDraft.errors) { // error when send invoice
        toastUp.handleStatus("error")
        toastUp.handleMessage("Error send invoice! quote saved as open")
        setButtonLoading(false)
        return
      }

      setButtonLoading()
      toastUp.handleStatus("success")
      toastUp.handleMessage("Invoice sent!!!")

    }, [companyName, handleTemplate, quoteId, quotesList, reqQuotesData, shipTo, toastUp]
  )

  const getCompaniesData = useCallback(async (page, rowsPerPage) => {
    const companyList = await getCompanies(page, rowsPerPage)
    if (!companyList) {
      console.log("error get quotes data!")
      return
    }
    setCompanies(companyList.data.company)
  }, [])

  useEffect(() => {
    getCompaniesData(0, 50)
  }, [getCompaniesData, refreshList]);

  useEffect(() => {
    if (tabContent && companies.length !== 0) {
      if (tabContent.company.name) {
        const selectedCompany = companies.find((company) => company.name === tabContent.company.name)
        const selectedLocation = selectedCompany.shipTo.find((ship) => ship.locationName === tabContent.company.shipTo)
        setShipToList(selectedCompany.shipTo)
        setLocation(selectedLocation.location)
        setCompanyContact(selectedCompany.contact[0])
      } else {
        setShipToList([])
        setCompanyContact()
        setLocation()
      }

      setCompanyName(tabContent.company.name)
      setShipTo(tabContent.company.shipTo)
      setQuotesList(tabContent.quotesList)
      setQuoteId(tabContent._id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Collapse in={addNewCompany ? false : true}>
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
                setShipToList={setShipToList}
                setLocation={setLocation}
                setShipTo={setShipTo}
                setCompanyName={setCompanyName}
                setRefreshList={setRefreshList}
                refreshList={refreshList}
              />
            </Collapse>
          </Box>
        </CardContent>
      </Card>
      <Collapse in={companyName ? true : false}>
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
      </Collapse>
      <Collapse in={companyName && quotesList.length > 0 ? true : false}>
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
      </Collapse>
    </>
  );
};
