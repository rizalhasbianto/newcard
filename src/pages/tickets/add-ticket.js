import Head from "next/head";
import { GetQuoteCollections, DeleteQuoteCollections } from "src/service/use-mongo";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import QuotesCollection from "src/sections/quotes/collections/QuotesCollection";
import TableLoading from "src/components/table-loading";
import NewTicketForm from "src/sections/tickets/ticket-form"
import { useToast } from "src/hooks/use-toast"; 
import Toast from "src/components/toast";

const Page = () => {
  const toastUp = useToast();

  return (
    <>
      <Head>
        <title>Add New Ticket | skratch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Toast
            toastStatus={toastUp.toastStatus}
            handleStatus={toastUp.handleStatus}
            toastMessage={toastUp.toastMessage}
          />
        <Container maxWidth="md">
          <NewTicketForm toastUp={toastUp}/>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
