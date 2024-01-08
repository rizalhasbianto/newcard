import Head from "next/head";
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Collapse,
  Card,
  CardContent,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import CloseIcon from "@mui/icons-material/Close";
import { CompanyCard } from "src/sections/companies/company-card";
import AddCompany from "src/sections/companies/company-add";
import { CompaniesSearch } from "src/sections/companies/companies-search";
import { GetCompaniesSwr, GetCompanies } from "src/service/use-mongo";
import { useEffect, useState } from "react";
import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";
import CardLoading from "src/components/grid-loading";

const Companies = () => {
  const [page, setPage] = useState(1);
  const [addNewCompany, setAddNewCompany] = useState(false);
  const [companies, setCompanies] = useState();
  const [shipToList, setShipToList] = useState();
  const [location, setLocation] = useState();
  const [shipTo, setShipTo] = useState();
  const [companyName, setCompanyName] = useState();
  const [companyContact, setCompanyContact] = useState();

  const { data: session } = useSession();
  const toastUp = useToast();
  const postPerPage = 6;
  const companyQuery = (session) => {
    switch (session.user.detail.role) {
      case "customer":
        return { _id: session?.user.detail.company.companyId };
      case "sales":
        return { "sales.name": session?.user.name };
      default:
        return {};
    }
  };

  const { data, isLoading, isError, mutate } = GetCompaniesSwr(page - 1, postPerPage, companyQuery(session));
  const [count, setCount] = useState(0);
  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (!data) return;
    setCount(Math.ceil(data.data.count / 6));
  }, [data]);

  return (
    <>
      <Head>
        <title>Companies | Skratch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Toast
            toastStatus={toastUp.toastStatus}
            handleStatus={toastUp.handleStatus}
            toastMessage={toastUp.toastMessage}
          />
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Companies</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      {!addNewCompany ? <PlusIcon /> : <CloseIcon />}
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => setAddNewCompany(!addNewCompany)}
                >
                  {!addNewCompany ? "Add" : "Cancel"}
                </Button>
              </div>
            </Stack>
            {
              //<CompaniesSearch />
            }
            <Collapse in={addNewCompany}>
              <Card>
                <CardContent>
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
                    session={session}
                    mutate={mutate}
                  />
                </CardContent>
              </Card>
            </Collapse>
            <Collapse in={!addNewCompany}>
              {isLoading && <CardLoading count={3} />}
              <Grid container spacing={3}>
                {(isError || (data && data.data.company.length === 0)) && (
                  <Grid xl={12} justifyItems={"center"} alignItems={"center"}>
                    <Typography variant="h5" textAlign={"center"}>
                      No data found!
                    </Typography>
                  </Grid>
                )}
                {data &&
                  data.data.company.map((company, i) => {
                    const getCurrentQuote = data.data.relatedQuote.filter(
                      (item) => item.company.name === company.name
                    );
                    return (
                      <Grid xs={12} md={6} lg={4} key={i + 1}>
                        <CompanyCard company={company} quoteTotal={getCurrentQuote.length} />
                      </Grid>
                    );
                  })}
              </Grid>
            </Collapse>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination count={count} page={page} size="small" onChange={handleChange} />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Companies;
