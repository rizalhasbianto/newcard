import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link'
import { deleteQuoteFromMongo } from 'src/service/use-mongo'
import PropTypes from 'prop-types';
import { format } from 'date-fns';
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
  Grid
} from '@mui/material';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { usePopover } from 'src/hooks/use-popover';
import AlertConfirm from 'src/components/alert-confirm'

export const QuotesTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => { },
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  const [deleteQuoteId, setDeleteQuoteId] = useState()

  const listNumber = page * 10;
  const modalPopUp = usePopover();

  const handleDelete = useCallback(
    async (quoteId) => {
      setDeleteQuoteId(quoteId)
      modalPopUp.handleContent(
        "Are you sure?",
        "This permanent delete, can not undo!"
      );
      modalPopUp.handleOpen();

      if (modalPopUp.agree) {
        console.log("quoteId", quoteId)
      }
    }, [modalPopUp]
  )

  const continueDelete = async () => {
    const resDelete = await deleteQuoteFromMongo(deleteQuoteId)
    if (!resDelete) {
      modalPopUp.handleContent(
        "Error Delete",
        "Error when deleting the quote, Please try again later!"
      );
      return
    }
    modalPopUp.handleClose()
    onPageChange(1, page)
  }

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
                <TableCell padding="checkbox">
                </TableCell>
                <TableCell>
                  Id
                </TableCell>
                <TableCell>
                  Ship To
                </TableCell>
                <TableCell>
                  Quote Info
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Last update
                </TableCell>
                <TableCell>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items && items.map((quote, index) => {
                const isSelected = selected.includes(quote.id);
                const lastUpdate = format(new Date(2014, 1, 11), 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={quote._id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Typography variant="subtitle2">
                        {index + listNumber + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        Po Number: #{quote._id.slice(-4)}
                      </Typography>
                      {
                        quote?.draftOrderNumber &&
                        <Typography variant="subtitle2">
                          Draft Order: {quote.draftOrderNumber}
                        </Typography>
                      }

                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="top"
                        direction="row"
                        spacing={2}
                      >
                        {quote?.company?.avatar &&
                          <Avatar src={quote.company.avatar}>
                            {getInitials(quote.company.company)}
                          </Avatar>
                        }
                        <Stack
                          alignItems="left"
                          direction="column"
                          spacing={0}
                        >
                          <Typography variant="subtitle2">
                            {quote?.company?.name}
                          </Typography>
                          <Typography variant="subtitle2">
                            {quote?.company?.shipTo}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="left"
                        direction="column"
                        spacing={1}
                      >
                        <Typography variant="subtitle2">
                          Total: ${quote?.quoteInfo?.total}
                        </Typography>
                        <Typography variant="subtitle2">
                          Number of Item: {quote?.quoteInfo?.item}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {quote?.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {lastUpdate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="flex-start"
                        direction="row"
                        spacing={1}
                      >
                        <Link
                          href={`/quotes/edit-quote?quoteId=${quote._id}`}
                          passHref
                        >
                          <SvgIcon
                            className="action"
                            color="action"
                            fontSize="small"
                          >
                            <PencilIcon />
                          </SvgIcon>
                        </Link>
                        <SvgIcon
                          className="action"
                          color="action"
                          fontSize="small"
                          onClick={() => handleDelete(quote._id)}
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

QuotesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
