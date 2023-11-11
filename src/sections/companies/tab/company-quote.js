import { format } from "date-fns";
import {
  Avatar,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { companyQuotesListHead } from "src/data/tableList";

export const CompanyQuote = (props) => {
  const { items = [] } = props;
  return (
    <Box>
      {items.length <= 0 ? (
        <Typography variant="subtitle2">This company is not have quote yet!</Typography>
      ) : (
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  {companyQuotesListHead.map((head) => {
                    return <TableCell key={head.title}>{head.title}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {items &&
                  items.map((quote, index) => {
                    const lastUpdate = format(new Date(2014, 1, 11), "dd/MM/yyyy");
                    return (
                      <TableRow hover key={quote._id}>
                        <TableCell padding="checkbox">
                          <Typography variant="subtitle2">{index + 1}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            Po Number: #{quote._id.slice(-4)}
                          </Typography>
                          {quote.draftOrderNumber && (
                            <Typography variant="subtitle2">
                              Draft Order: {quote.draftOrderNumber}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack alignItems="top" direction="row" spacing={2}>
                            {quote.company?.avatar && (
                              <Avatar src={quote.company.avatar}>
                                {getInitials(quote.company.company)}
                              </Avatar>
                            )}
                            <Stack alignItems="left" direction="column" spacing={0}>
                              <Typography variant="subtitle2">{quote.company?.name},</Typography>
                              <Typography variant="subtitle2">{quote.company?.shipTo}</Typography>
                            </Stack>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack alignItems="left" direction="column" spacing={0}>
                            <Typography variant="subtitle2">
                              ${new Intl.NumberFormat("en-US").format(quote.quoteInfo?.total)}
                            </Typography>
                            <Typography variant="subtitle2">
                              ( {quote.quoteInfo?.item} Item{quote.quoteInfo?.item > 1 ? "'s" : ""}{" "}
                              )
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{quote.status}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{lastUpdate}</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      )}
    </Box>
  );
};
