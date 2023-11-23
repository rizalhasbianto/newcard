import { Unstable_Grid2 as Grid } from "@mui/material";

import { ProductCard } from "./product-card";

export const ProductGrid = (props) => {
  const { handleOpenQuoteList, data, toastUp, quoteId } = props;
  return (
    data &&
    data.map((dt) => {
      return dt.newData.edges.map((product, i) => (
        <Grid xs={12} md={6} lg={3} key={i + 1}>
          <ProductCard
            product={product}
            handleOpenQuoteList={handleOpenQuoteList}
            toastUp={toastUp}
            quoteId={quoteId}
          />
        </Grid>
      ));
    })
  );
};
