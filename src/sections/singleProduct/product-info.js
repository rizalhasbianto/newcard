import { useCallback, useEffect, useState } from "react";

import {
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { ImageComponent } from "src/components/image";

export const ProductInfo = (props) => {
  const { productData, inventory } = props;
  return (
    <Stack spacing={2}>
      <Typography variant="h5">{productData.title}</Typography>
      <Typography variant="h6">${productData.priceRange.maxVariantPrice.amount}</Typography>
      { !inventory && <Typography variant="body2">{productData.description}</Typography> }
    </Stack>
  );
};
