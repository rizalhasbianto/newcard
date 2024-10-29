import { Box, Grid } from "@mui/material";

import ProductCard from "./product-card";
import ProductCardCustomer from "./product-card-customer";

const ProductGrid = (props) => {
  const { handleOpenQuoteList, data, catalogCompany, toastUp, quoteId, session } = props;

  return (
    data &&
    data.map((dt) => {
      return dt.newData.edges.map((product, i) => (
        <Grid item xs={12} md={4} lg={4} key={i + 1}>
          {session.user.detail.role === "customer" ? (
            <ProductCardCustomer
              product={product}
              handleOpenQuoteList={handleOpenQuoteList}
              catalogCompany={catalogCompany}
              toastUp={toastUp}
              quoteId={quoteId}
              session={session}
            />
          ) : (
            <ProductCard
              product={product}
              handleOpenQuoteList={handleOpenQuoteList}
              catalogCompany={catalogCompany}
              toastUp={toastUp}
              quoteId={quoteId}
              session={session}
            />
          )}
        </Grid>
      ));
    })
  );
};

export default ProductGrid;
