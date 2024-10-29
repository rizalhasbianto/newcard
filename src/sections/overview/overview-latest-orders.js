import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import Link from "next/link";

const statusMap = {
  pending: "warning",
  delivered: "success",
  refunded: "error",
};

export const OverviewLatestOrders = (props) => {
  const { todayOrders = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Today Orders" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box>
          {todayOrders.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todayOrders.map((order) => {
                  return (
                    <TableRow hover key={order.name}>
                      <TableCell>{order.name}</TableCell>
                      <TableCell>{order.customer.first_name} {order.customer.last_name} {order.company?.name && `| ${order.company.name}`}</TableCell>
                      <TableCell>${order.current_subtotal_price}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Typography color="text.secondary" variant="body2" sx={{ textAlign: "center" }}>
              No Order Found
            </Typography>
          )}
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
      <Link href={`/dashboard/orders`} passHref>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
          variant="text"
        >
          View all
        </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
