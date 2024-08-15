import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Box,
    Typography
} from "@mui/material";
import { singleInventoryHead } from "src/data/tableList";

export const ProductInventory = (props) => {
  const { inventoryData } = props;
  const items = inventoryData.newData.data.productByHandle.variants.edges
  const InventoryQty = ({ data, selected }) => {
    if(!data) return 
    const qty = data.find((item) => item.name === selected);
    return qty.quantity;
  };

  return (
    <Table sx={{mt:2}}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              {singleInventoryHead.map((item, i) => (
                <TableCell key={i + 1}>
                  {item.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, i) => (
              <TableRow hover key={i + 1} sx={{cursor:"pointer"}} onClick={() => router.push(`/products/${item.node.variant.product.handle}/?inventory=yes`)}>
                <TableCell padding="checkbox">{i + 1}</TableCell>
                <TableCell>{item.node.title.replace("- Default Title","")}</TableCell>
                <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        <InventoryQty data={item.node.inventoryItem.inventoryLevel?.quantities} selected="committed" />
                      </Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        <InventoryQty data={item.node.inventoryItem.inventoryLevel?.quantities} selected="available" />
                      </Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        <InventoryQty data={item.node.inventoryItem.inventoryLevel?.quantities} selected="on_hand" />
                      </Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        <InventoryQty data={item.node.inventoryItem.inventoryLevel?.quantities} selected="incoming" />
                        {item.node.inventoryItem.inventoryLevel?.scheduledChanges?.nodes.length > 0 
                        ? ` at ${format(new Date(item.node.inventoryItem.inventoryLevel?.scheduledChanges?.nodes[0].expectedAt), "dd/MM/yyyy")}`
                        : "" 
                      }
                      </Typography>
                    </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
  );
};
