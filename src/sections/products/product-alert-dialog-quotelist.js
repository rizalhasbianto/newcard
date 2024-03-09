import { useCallback, useEffect, useState } from "react";
import { GetQuotesData, GetCompanies } from "src/service/use-mongo";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Avatar,
  Stack,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import { quotesListHeadProduct } from "src/data/tableList";
import { useRouter } from "next/router";

export default function ProductAddToQuote(props) {
  const { session, openQuote, setOpenQuote } = props;
  const [quoteList, setQuoteList] = useState([]);
  const router = useRouter();

  const handleSelectQuote = (id) => {
    setOpenQuote(false);
    const pathName = router.asPath.split("?");
    router.push(`${pathName[0]}?quoteId=` + id);
  };

  const handleGetQuoteList = async () => {
    let quoteQuery;
    if (session?.user?.detail?.role === "customer") {
      quoteQuery = {
        $or: [{ status: "draft" }, { status: "new" }, { status: "open" }],
        "createdBy.company": session?.user?.detail?.company.companyName,
      };
    } else if (session?.user?.detail?.role === "sales") {
      const getCompanyBySales = await GetCompanies({
        query: { "sales.id": session?.user?.detail?.id },
      });
      const companyBySales = getCompanyBySales.data.company.map((itm) => {
        return { "createdBy.company": itm.name };
      });
      quoteQuery = {
        $or: [
          {
            $or: [{ status: "draft" }, { status: "new" }, { status: "open" }],
            "createdBy.name": session?.user?.detail?.name,
          },
          {
            status: "open",
            $or: companyBySales,
          },
        ],
      };
    } else {
      quoteQuery = {
        $or: [
          {
            $or: [{ status: "draft" }, { status: "new" }, { status: "open" }],
            "createdBy.name": session?.user?.detail?.name,
          },
          {
            status: "open",
          },
        ],
      };
    }
    const sort = "DSC";
    const resQuotes = await GetQuotesData(0, 50, quoteQuery, sort);
    if (!resQuotes) {
      console.log("resQuotes", resQuotes);
      return;
    }
    setQuoteList(resQuotes.data.quote);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    if(openQuote) {
      handleGetQuoteList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openQuote]);
console.log("quoteList", quoteList)
  return (
    <Dialog
      open={openQuote}
      onClose={() => setOpenQuote(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ maxWidth: "100%" }}
    >
      <DialogTitle id="alert-dialog-title">Please choose the quote</DialogTitle>
      <DialogContent sx={{ width: "800px" }}>
        <Table>
          <TableHead>
            <TableRow>
              {quotesListHeadProduct.map((head) => {
                return <TableCell key={head.title}>{head.title}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {quoteList.length > 0 &&
              quoteList.map((quote, i) => (
                <TableRow hover selected={true} key={i + 1}>
                  <TableCell padding="checkbox">
                    <Typography variant="subtitle2">#{quote._id.slice(-4)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack alignItems="right" direction="column" spacing={1}>
                      <Typography variant="subtitle2">
                        ${new Intl.NumberFormat("en-US").format(quote.quoteInfo?.total)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack alignItems="right" direction="column" spacing={1}>
                      <Typography variant="subtitle2">
                        ( {quote.quoteInfo?.item} Item{quote.quoteInfo?.item > 1 ? "'s" : ""} )
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack alignItems="right" direction="column" spacing={1}>
                      <Typography variant="subtitle2">{quote.company.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack alignItems="right" direction="column" spacing={1}>
                      <Typography variant="subtitle2">
                        {quote.createdBy.name} / {quote.createdBy.role}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <LoadingButton
                      color="primary"
                      onClick={() => handleSelectQuote(quote._id)}
                      loading={false}
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="contained"
                    >
                      Select
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenQuote(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
