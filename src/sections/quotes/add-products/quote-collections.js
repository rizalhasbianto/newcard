import { useCallback, useEffect, useState, Fragment } from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  TableContainer,
  TableRow,
  TextField,
  MenuItem,
  Typography,
  SvgIcon,
  Skeleton,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AddIcon from "@mui/icons-material/Add";
import { quotesCollectionHead } from "src/data/tableList";

import { GetQuoteCollections, DeleteQuoteCollections } from "src/service/use-mongo";
import { Stack } from "@mui/system";

export const QuoteCollections = ({ quotesList, setQuotesList }) => {

  const { data, isLoading, isError, mutate, isValidating } = GetQuoteCollections();

  const totalItem = useCallback(
    (item) => {
      const qty = item.quotesList.reduce((partialSum, a) => partialSum + a.qty, 0);
      const totalPrice = item.quotesList.reduce((partialSum, a) => partialSum + Number(a.total), 0);
      return { items: item.quotesList.length, qty: qty, totalPrice: totalPrice };
    },
    [data]
  );

  const handleSetQuoteList = (prodItem, type) => {
    if(type === "replace") {
      setQuotesList(prodItem.quotesList)
    } else {
      setQuotesList([...prodItem.quotesList, ...quotesList])
    }
    }

  return (
    <Box>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {quotesCollectionHead.map((head) => {
                return (
                  <TableCell
                    key={head.title}
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {head.title}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody sx={{ maxHeight: "500px" }}>
            {data &&
              data.data.collections.map((item, i) => {
                const info = totalItem(item);
                return (
                  <TableRow key={i + 1}>
                    <TableCell padding="checkbox">
                      <Typography>{i + 1}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>{item.collectionName}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>${info.totalPrice}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>
                        {info.items} item ({info.qty} qty)
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction={"row"} spacing={2} justifyContent={"center"}>
                        <LoadingButton
                          color="primary"
                          onClick={() => handleSetQuoteList(item,"replace")}
                          loading={false}
                          loadingPosition="start"
                          startIcon={<AutorenewIcon />}
                          variant="contained"
                        >
                          Replace List
                        </LoadingButton>
                        <LoadingButton
                          color="primary"
                          onClick={() => handleSetQuoteList(item, "append")}
                          loading={false}
                          loadingPosition="start"
                          startIcon={<AddIcon />}
                          variant="contained"
                        >
                          Append List
                        </LoadingButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
