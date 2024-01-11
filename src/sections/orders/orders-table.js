import { useRouter } from 'next/router'
import { format } from "date-fns";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  SvgIcon,
  TableFooter,
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { Scrollbar } from "src/components/scrollbar";
import { ordersListHead } from "src/data/tableList";

const OrdersTable = (props) => {
  const {
    items = [],
    handlePageChange,
    pageNumber = 0,
    hasPrev,
    hasNext
  } = props;
  const router = useRouter()
  const listNumber = pageNumber * 10;
console.log("items", items)
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
                  const orderID = order.id.replace("gid://shopify/Order/", "")
                  return (
                    <TableRow hover key={index + 1} sx={{cursor:"pointer"}} onClick={() => router.push(`/orders/${orderID}`)}>
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

export default OrdersTable