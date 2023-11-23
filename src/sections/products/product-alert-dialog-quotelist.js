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
import { useRouter } from 'next/router'

export default function ProductAddToQuote(props) {
  const { quoteList, openQuote, setOpenQuote } = props;
  const router = useRouter()

  const handleSelectQuote = (id) => {
    const pathName = router.asPath.split("?")
    router.push(`${pathName[0]}?quoteId=`+id)
    setOpenQuote(false)
  }

  return (
    <Dialog
      open={openQuote}
      onClose={() => setOpenQuote(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Please choose the quote</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              {quotesListHeadProduct.map((head) => {
                return <TableCell key={head.title}>{head.title}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {quoteList &&
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
