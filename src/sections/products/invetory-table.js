import { useRouter } from 'next/router'

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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { inventoryHead } from "src/data/tableList";

const InventoryTable = (props) => {
  const { items = [], handlePageChange, pageNumber = 0, hasPrev, hasNext } = props;
  const router = useRouter()
  const listNumber = pageNumber * 10;

  const InvenotryQty = ({ data, selected }) => {
    const qty = data.find((item) => item.name === selected);
    return qty.quantity;
  };
  console.log("items", items)
  return (
    <Card>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              {inventoryHead.map((item, i) => (
                <TableCell key={i + 1}>
                  {item.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, i) => (
              <TableRow hover key={i + 1} sx={{cursor:"pointer"}} onClick={() => router.push(`/products/${item.node.variant.product.handle}/?inventory=yes`)}>
                <TableCell padding="checkbox">{i + listNumber + 1}</TableCell>
                <TableCell>{item.node.variant.displayName.replace("- Default Title","")}</TableCell>
                <TableCell>{item.node.variant.sku}</TableCell>
                <TableCell>
                  {item.node.inventoryLevels.edges.map((edge, idx) => (
                    <Box key={idx + 1}>
                      <Typography variant="subtitle2">
                        <InvenotryQty data={edge.node.quantities} selected="committed" />
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
                <TableCell>
                  {item.node.inventoryLevels.edges.map((edge, idx) => (
                    <Box key={idx + 1}>
                      <Typography variant="subtitle2">
                        <InvenotryQty data={edge.node.quantities} selected="available" />
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
                <TableCell>
                  {item.node.inventoryLevels.edges.map((edge, idx) => (
                    <Box key={idx + 1}>
                      <Typography variant="subtitle2">
                        <InvenotryQty data={edge.node.quantities} selected="on_hand" />
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
                <TableCell>
                  {item.node.inventoryLevels.edges.map((edge, idx) => (
                    <Box key={idx + 1}>
                      <Typography variant="subtitle2">
                        <InvenotryQty data={edge.node.quantities} selected="incoming" />
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
              </TableRow>
            ))}
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
    </Card>
  );
};

export default InventoryTable