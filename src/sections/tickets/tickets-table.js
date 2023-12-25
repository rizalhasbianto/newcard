import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { DeleteQuoteFromMongo } from "src/service/use-mongo";
import PropTypes from "prop-types";
import { intervalToDuration } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  SvgIcon,
  CardContent,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Tags } from "src/components/tags";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { usePopover } from "src/hooks/use-popover";
import AlertConfirm from "src/components/alert-confirm";
import { ticketsHead } from "src/data/tableList";
import { MessageList } from "src/sections/tickets/message-list";
import { ReplyTicketForm } from "src/sections/tickets/ticket-form"

export const TicketsTable = (props) => {
  const {
    items = [],
    mutateData = () => {},
    page = 0,
  } = props;

  const [deleteQuoteId, setDeleteQuoteId] = useState();
  const [selectedTicket, setSelectedTicket] = useState(items[0]);

  const listNumber = page * 10;
  const modalPopUp = usePopover();

  const handleDelete = useCallback(
    async (quoteId) => {
      setDeleteQuoteId(quoteId);
      modalPopUp.handleContent("Are you sure?", "This permanent delete, can not undo!");
      modalPopUp.handleOpen();

      if (modalPopUp.agree) {
        console.log("quoteId", quoteId);
      }
    },
    [modalPopUp]
  );

  const continueDelete = async () => {
    const resDelete = await DeleteQuoteFromMongo(deleteQuoteId);
    if (!resDelete) {
      modalPopUp.handleContent(
        "Error Delete",
        "Error when deleting the quote, Please try again later!"
      );
      return;
    }
    modalPopUp.handleClose();
    mutateData();
  };

  const CountDownTime = useCallback(
    (props) => {
      if (!props.time) return "";

      const now = utcToZonedTime(new Date(), "America/Los_Angeles");
      const time = intervalToDuration({
        start: new Date(props.time),
        end: now,
      });

      if (time.days !== 0) {
        return time.days + " days ago";
      }
      if (time.hours !== 0) {
        return time.hours + " hours ago";
      }
      if (time.minutes !== 0) {
        return time.minutes + " min ago";
      }
      if (time.seconds !== 0) {
        return time.seconds + " sec ago";
      }
      return "";
    },
    [items]
  );

  useEffect(
    () => {
      const newUpdateTicket = items.find((item) => item._id === selectedTicket._id)
      setSelectedTicket(newUpdateTicket)
    },[items]
  )
  console.log("selectedTicket", selectedTicket)

  return (
    <Grid container spacing={4}>
      <Grid xl={4}>
        <Scrollbar sx={{ maxHeight: "calc(100vh - 230px)", pr:2, position:"sticky", top:"100px" }}>
          {items.map((item, i) => {
            return (
              <Card
                key={i + 1}
                sx={{ mb: 2, cursor: "pointer", border:selectedTicket._id === item._id ? "1px solid #000" : "1px solid #fff" }}
                onClick={() => setSelectedTicket(item)}
              >
                <CardContent>
                  <Stack direction={"row"} justifyContent={"space-between"} sx={{ mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1">
                        {item.createdBy.company.companyName}, {item.createdBy.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color={"neutral.500"}>
                        <CountDownTime time={item.lastUpdateAt} />
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color={"neutral.800"}>
                      {item.subject}
                    </Typography>
                  </Box>
                  <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <Typography variant="subtitle2">
                      <Tags tag={item.status} />
                    </Typography>
                    <Typography variant="subtitle2"><Tags tag={item.category} /></Typography>
                    <Typography variant="subtitle2" color={"neutral.500"}>
                    <Tags tag={`#${item._id.slice(-4)}`} />
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Scrollbar>
      </Grid>
      <Grid xl={8}>
        <MessageList dataTicket={selectedTicket} />
        <ReplyTicketForm oldMessage={selectedTicket?.ticketMessages} id={selectedTicket?._id} mutateData={mutateData}/>
      </Grid>
    </Grid>
  );
};
