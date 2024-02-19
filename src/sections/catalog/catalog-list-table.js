import { useCallback, useEffect, useState, Fragment } from "react";
import Link from "next/link";

import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  TableContainer,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Typography,
  Stack,
  SvgIcon,
  Skeleton,
  Unstable_Grid2 as Grid,
  CardHeader,
  Button,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AlertDialog from "src/components/alert-dialog";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TableLoading from "src/components/table-loading";
import { Scrollbar } from "src/components/scrollbar";
import { ImageComponent } from "src/components/image";

import { catalogTable } from "src/data/tableList";
import { usePopover } from "src/hooks/use-popover";

const CatalogListTable = (props) => {
  const { catalogs } = props;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ pt: 0 }}>
        <Grid lg={12} sx={{ mt: 2, position: "relative" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {catalogTable.map((head) => {
                    return (
                      <TableCell
                        key={head.title}
                        sx={{
                          textAlign: "left",
                        }}
                      >
                        {head.title}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody sx={{ maxHeight: "500px" }}>
                {catalogs.newData.map((item) => {
                  const id = item.node.id.replace("gid://shopify/CompanyLocationCatalog/", "");
                  return (
                    <TableRow key={id}>
                      <TableCell padding="checkbox">
                        <Typography><Link href={`/products/catalogs/${id}`}>#{id}</Link></Typography>
                      </TableCell>
                      <TableCell>{item.node.title}</TableCell>
                      <TableCell>{item.node.companyLocationsCount}</TableCell>
                      {item.node.priceList?.fixedPricesCount ? (
                        <TableCell>{item.node.priceList?.fixedPricesCount}</TableCell>
                      ) : (
                        <TableCell>-</TableCell>
                      )}
                      {item.node.priceList?.parent?.adjustment?.type ? (
                        <TableCell>
                          {item.node.priceList?.parent?.adjustment?.type.replace("PERCENTAGE_", "")}{" "}
                          %{item.node.priceList?.parent?.adjustment?.value}
                        </TableCell>
                      ) : (
                        <TableCell>-</TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CatalogListTable;
