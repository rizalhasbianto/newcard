import Head from "next/head";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CompanyCard } from "src/sections/companies/company-card";
import { AddCompany } from "src/sections/companies/company-add";
import { CompaniesSearch } from "src/sections/companies/companies-search";
import { GetCompaniesSwr } from "src/service/use-mongo";
import { useState } from "react";

const Page = () => {
  const [page, setPage] = useState(0);
  const postPerPage = 6
  const { data, isLoading, isError } = GetCompaniesSwr(page, postPerPage);
  const handleChange = (event, value) => {
    console.log("value", value)
    setPage(value - 1);
  };
  return (
    <>
      <Head>
        <title>Companies | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Companies</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CompaniesSearch />
            <Grid container spacing={3}>
              {isError && <Typography variant="h5">No data found!</Typography>}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {
                data &&
<Pagination
                count={Math.ceil(data.data.count / 6)}
                size="small"
                onChange={handleChange}
              />
              }
              
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
