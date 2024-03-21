import { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Box,
  Stack,
  SvgIcon,
  TableRow,
  TableCell,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import Image from "next/image";
import ArchiveBoxIcon from "@heroicons/react/24/solid/ArchiveBoxIcon";
import ArchiveBoxXMarkIcon from "@heroicons/react/24/solid/ArchiveBoxXMarkIcon";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import OptionsComponent from "src/components/products/options";
import { minHeight } from "@mui/system";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function EditProductItem(props) {
  const {
    quote,
    productData,
    index,
    setQuotesList,
    quotesList,
    setEditProductIndex,
    shopifyCompanyLocationID,
  } = props;
  const [img, setImg] = useState(quote.variant.image.url);
  const [selectedVariant, setSelectedVariant] = useState(quote.variant);
  const [selectedOptions, setSelectedOptions] = useState(
    quote.variant.selectedOptions.reduce((acc, curr) => ((acc[curr.name] = curr.value), acc), {})
  );
  const [selectedQuantity, setSelectedQuantity] = useState(quote.qty);
  const [total, setTotal] = useState((quote.variant.companyPrice.node[`company_${shopifyCompanyLocationID}`]?.price.amount * quote.qty).toFixed(2));
  const handleChangeOptions = useCallback(
    (event, newSingleOption) => {
      const getSelectedOption = newSingleOption.split(":");
      const newSelectedOptions = {
        ...selectedOptions,
        [getSelectedOption[0]]: getSelectedOption[1],
      };
      const variants = productData.data.variants.edges;
      const newSelecetdVariant = variants.find((variant) => {
        return variant.node.selectedOptions.every((selectedOption) => {
          return newSelectedOptions[selectedOption.name] === selectedOption.value;
        });
      });
      setSelectedOptions(newSelectedOptions);
      setSelectedVariant(newSelecetdVariant?.node);
      setImg(newSelecetdVariant?.node.image.url);
    },
    [productData, selectedOptions]
  );

  const handleSaveLineItem = useCallback(() => {
    const newQuotesList = quotesList.map((lineItem, i) => {
      if (i === index) {
        const newLineItem = {
          productName: quote.productName,
          qty: selectedQuantity,
          variant: selectedVariant,
        };
        return newLineItem;
      } else {
        return lineItem;
      }
    });
    setQuotesList(newQuotesList);
    setEditProductIndex("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedVariant,
    quotesList,
    quote,
    selectedQuantity,
    total,
    index,
    setQuotesList,
    setEditProductIndex,
  ]);

  const handleCancel = useCallback(() => {
    setEditProductIndex("");
  }, [setEditProductIndex]);
  console.log("quote", quote);
  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={"edit" - index}>
      <TableCell sx={{ minWidth: "250px" }}>
        <Typography variant="subtitle2">{quote.productName}</Typography>
        <Grid container>
          <Grid
            xs={12}
            md={6}
            sx={{
              position: "relative",
              minHeight: "100px",
            }}
          >
            <Image
              src={img}
              fill={true}
              alt="Picture of the author"
              className="shopify-fill"
              sizes="270 640 750"
            />
          </Grid>
          <Grid xs={12} md={12}>
            <OptionsComponent
              options={productData?.data.options}
              handleChange={handleChangeOptions}
              selectedOpt={selectedOptions}
            />
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <TextField
          id="qtySingle"
          label="Quantity"
          variant="outlined"
          InputProps={{ inputProps: { min: 1 } }}
          type="number"
          sx={{
            mt: "10px",
            mb: "10px",
          }}
          value={selectedQuantity}
          onChange={(event) => {
            const price =
            selectedVariant.companyPrice.node[`company_${shopifyCompanyLocationID}`]?.price.amount;
            setSelectedQuantity(event.target.value);
            setTotal((price * event.target.value).toFixed(2));
          }}
        />
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
          }}
        >
          {quote.variant.currentlyNotInStock ? "Out of Stock" : "In Stock"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            textAlign: "right",
          }}
        >
          ${quote.variant.companyPrice.node[`company_${shopifyCompanyLocationID}`]?.price.amount}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            textAlign: "right",
          }}
        >
          ${total}
        </Typography>
      </TableCell>
      <TableCell>
        <Stack justifyContent="center" direction="row" spacing={1}>
          <SvgIcon
            color="action"
            fontSize="small"
            sx={{ "&:hover": { color: "#1c2536", cursor: "pointer" } }}
            onClick={handleSaveLineItem}
          >
            <SaveIcon />
          </SvgIcon>
          <SvgIcon
            color="action"
            fontSize="small"
            sx={{ "&:hover": { color: "#1c2536", cursor: "pointer" } }}
            onClick={handleCancel}
          >
            <CancelIcon />
          </SvgIcon>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
