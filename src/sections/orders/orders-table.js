import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { DeleteQuoteFromMongo } from "src/service/use-mongo";
import PropTypes from "prop-types";
import { format } from "date-fns";
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
  Grid,
  TableFooter,
} from "@mui/material";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { usePopover } from "src/hooks/use-popover";
import AlertConfirm from "src/components/alert-confirm";
import { ordersListHead } from "src/data/tableList";

export const OrdersTable = (props) => {
  const {
    items = [],
    handlePageChange,
    pageNumber = 0,
    hasPrev,
    hasNext
  } = props;

  const listNumber = pageNumber * 10;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                {ordersListHead.map((head) => {
                  return <TableCell key={head.title}>{head.title}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {items &&
                items.map((item, index) => {
                  const order = item.node;
                  const lastUpdate = format(new Date(order.createdAt), "dd/MM/yyyy");
                  return (
                    <TableRow hover key={index + 1}>
                      <TableCell padding="checkbox">
                        <Typography variant="subtitle2">{index + listNumber + 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Order Id: {order.name}</Typography>
                        <Typography variant="subtitle2">
                          Po Number: #{order.poNumber?.slice(-4)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{lastUpdate}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{order?.customer?.displayName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {order?.currentTotalPriceSet?.shopMoney?.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{order?.displayFinancialStatus}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {order?.displayFulfillmentStatus}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell 
                  colSpan={7}
                  sx={{
                    textAlign:"right",
                    padding:"20px"
                  }}
                >
                <SvgIcon 
                  className={`action nav-ico ${!hasPrev && "disable"}`}
                  onClick={() => handlePageChange("prev")}
                >
                  <ArrowBackIosIcon />
                </SvgIcon>
                <SvgIcon 
                  className={`action nav-ico ${!hasNext && "disable"}`}
                  onClick={() => handlePageChange("next")}
                >
                  <ArrowForwardIosIcon />
                </SvgIcon>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

OrdersTable.propTypes = {
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
  selected: PropTypes.array,
};
