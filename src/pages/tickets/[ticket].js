import Head from "next/head";
import { useRouter } from 'next/router';
import { GetTicketsDataSwr } from "src/service/use-mongo";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ReplyTicketForm } from "src/sections/tickets/ticket-form";
import { MessageList } from "src/sections/tickets/message-list";
import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";

const Page = () => {
    const router = useRouter();
    const { ticket } = router.query;
  const toastUp = useToast();
  const page = 0;
  const rowsPerPage = 10;
  const query = { ticketId: ticket };
  const sort = "DSC";
  const type = "id";
  const { data, isLoading, isError, mutate, isValidating } = GetTicketsDataSwr(
    page,
    rowsPerPage,
    query,
    sort,
    type
  );
const ticketData = data && data.data.ticket[0]
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
          {data && (
            <>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid xl={4}>ID: #{ticketData._id.slice(-4)}</Grid>
                      <Grid xl={4}>Status: {ticketData.status}</Grid>
                      <Grid xl={4}>Company: {ticketData.createdBy.company.companyName}</Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
              <MessageList messages={ticketData.ticketMessages}/>
              <ReplyTicketForm toastUp={toastUp} />
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
