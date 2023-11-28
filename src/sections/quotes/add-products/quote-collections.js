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
import AddIcon from '@mui/icons-material/Add';
import { quotesCollectionHead } from "src/data/tableList";

import { GetQuoteCollections, DeleteQuoteCollections } from "src/service/use-mongo";
import { Stack } from "@mui/system";

export const QuoteCollections = () => {
  const { data, isLoading, isError, mutate, isValidating } = GetQuoteCollections();

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
              data.data.collections.map((item, i) => (
                <TableRow key={i + 1}>
                  <TableCell padding="checkbox">
                    <Typography>{i+1}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography>{item.collectionName}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>$100</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography>3 item (20qty)</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction={"row"} spacing={2} justifyContent={"center"}>
                  <LoadingButton
                        color="primary"
                        //onClick={() => handleLoadMore()}
                        loading={false}
                        loadingPosition="start"
                        startIcon={<AutorenewIcon />}
                        variant="contained"
                      >
                        Replace List
                      </LoadingButton>
                      <LoadingButton
                        color="primary"
                        //onClick={() => handleLoadMore()}
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
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
