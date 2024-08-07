import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Card,
  Grid,
} from "@mui/material";

import Productlist from "./product-list";
import { quotesQuickAddHead } from "src/data/tableList";
import { Scrollbar } from "src/components/scrollbar";

const ProductTable = (props) => {
  const { handleOpenQuoteList, data, catalogCompany, toastUp, productPerPage, quoteId, session } = props;
console.log("data prod", data)
  return (
    data && (
      <Grid 
          item 
          xs={12} 
          md={12} 
          lg={12}
        >
      <Card sx={{ minWidth: "100%"}}>
        <Box sx={{ minWidth: "100%"}}>
          <Table>
            <TableHead>
              <TableRow>
                {quotesQuickAddHead.map((head) => {
                  return <TableCell key={head.title} sx={{textAlign:"center"}}>{head.title}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((dt, idx) => {
                return dt.newData.edges.map((product, i) => (
                  <Productlist
                    product={product}
                    handleOpenQuoteList={handleOpenQuoteList}
                    toastUp={toastUp}
                    noUrut={idx * productPerPage + (i + 1)}
                    quoteId={quoteId}
                    catalogCompany={catalogCompany}
                    key={i + 1}
                    session={session}
                  />
                ));
              })}
            </TableBody>
          </Table>
        </Box>
      </Card>
      </Grid>
    )
  );
};

export default ProductTable