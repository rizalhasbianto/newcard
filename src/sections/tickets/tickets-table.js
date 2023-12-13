import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { DeleteQuoteFromMongo } from "src/service/use-mongo";
import PropTypes from "prop-types";
import { format } from "date-fns-tz";
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
} from "@mui/material";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { usePopover } from "src/hooks/use-popover";
import AlertConfirm from "src/components/alert-confirm";
import { ticketsHead } from "src/data/tableList";

export const TicketsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    mutateData = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const [deleteQuoteId, setDeleteQuoteId] = useState();

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

  return (
    <Card>
      <AlertConfirm
        title={modalPopUp.message.title}
        content={modalPopUp.message.content}
        open={modalPopUp.open}
        handleClose={modalPopUp.handleClose}
        handleContinue={continueDelete}
      />
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                {ticketsHead.map((head) => {
                  return <TableCell key={head.title}>{head.title}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {items &&
                items.map((ticket, index) => {
                  const createdAt = ticket.createdAt ? format(new Date(ticket.createdAt), "dd/MM/yyyy") : "";
                  const lastUpdate = ticket.lastUpdateAt ? format(new Date(ticket.lastUpdateAt), "dd/MM/yyyy") : "";
                  return (
                    <TableRow hover key={ticket._id}>
                      <TableCell padding="checkbox">
                        <Typography variant="subtitle2">{index + listNumber + 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">#{ticket._id.slice(-4)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                            <Typography variant="subtitle2">
                              {ticket.createdBy.company.companyName}, {ticket.createdBy.name}
                            </Typography>
                      </TableCell>
                      <TableCell>
                          <Typography variant="subtitle2">
                            {ticket.subject}
                          </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="right" direction="column" spacing={1}>
                          <Typography variant="subtitle2">
                          {ticket.status}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{createdAt}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{lastUpdate}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="flex-start" direction="row" spacing={1}>
                          <Link href={`/tickets/${ticket._id}`} passHref>
                            <SvgIcon className="action" color="action" fontSize="small">
                              <PencilIcon />
                            </SvgIcon>
                          </Link>
                          <SvgIcon
                            className="action"
                            color="action"
                            fontSize="small"
                            onClick={() => handleDelete(ticket._id)}
                          >
                            <TrashIcon />
                          </SvgIcon>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Card>
  );
};

