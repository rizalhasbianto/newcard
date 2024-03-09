import { Box, Grid } from "@mui/material";

import ProductCard from "./product-card";

const ProductGrid = (props) => {
  const { handleOpenQuoteList, data, catalogCompany, toastUp, quoteId } = props;
  return (
    data &&
    data.map((dt) => {
      return dt.newData.edges.map((product, i) => (
        <Grid 
          item 
          xs={12} 
          md={4} 
          lg={4} 
          key={i + 1}
        >
          <ProductCard
            product={product}
            handleOpenQuoteList={handleOpenQuoteList}
            catalogCompany={catalogCompany}
            toastUp={toastUp}
            quoteId={quoteId}
          />
        </Grid>
      ));
    })
  );
};

export default ProductGrid 