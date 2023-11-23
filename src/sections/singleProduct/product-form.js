/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import OptionsComponent from "src/components/products/options";
import AlertDialog from "src/components/alert-dialog";
import { usePopover } from "src/hooks/use-popover";
import { addQuote } from "src/helper/handleAddQuote";
import {
  Button,
  TextField,
  Typography,
  Stack,
  Divider,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { ImageComponent } from "src/components/image";

export const ProductFrom = (props) => {
  const {
    quotesList,
    setQuotesList,
    selectedProduct,
    setSelectedImgVariant,
    setSelectedTab,
    quoteId,
  } = props;
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [notAvilableOption, setNotAvilableOption] = useState(false);
  const modalPopUp = usePopover();

  useEffect(() => {
    if (!selectedProduct) return undefined;
    const selectedVar = selectedProduct.variants.edges[0].node;
    const selectedOpt = selectedVar.selectedOptions.reduce(
      (acc, curr) => ((acc[curr.name] = curr.value), acc),
      {}
    );
    setSelectedVariant(selectedVar);
    setSelectedOptions(selectedOpt);
  }, [selectedProduct]);

  const handleChange = (event, newSingleOption) => {
    const getSelectedOption = newSingleOption.split(":");
    const newSelectedOptions = {
      ...selectedOptions,
      [getSelectedOption[0]]: getSelectedOption[1],
    };
    const variants = selectedProduct.variants.edges;
    const newSelecetdVariant = variants.find((variant) => {
      return variant.node.selectedOptions.every((selectedOption) => {
        return newSelectedOptions[selectedOption.name] === selectedOption.value;
      });
    });
    setSelectedOptions(newSelectedOptions);

    if (newSelecetdVariant) {
      setNotAvilableOption(false);
      setSelectedVariant(newSelecetdVariant?.node);
      setSelectedImgVariant(newSelecetdVariant?.node.image.bigUrl);
      setSelectedTab(0);
    } else {
      setNotAvilableOption(true);
    }
  };

  const handleAddQuote = async () => {
    if (!router.query.quoteId) {
      return;
    }

    const updateQuote = {
      productName: selectedProduct.title,
      variant: selectedVariant,
      qty: selectedQuantity,
      total: (selectedQuantity * selectedVariant.price.amount).toFixed(2),
    };

    const resUpdateQuote = await UpdateQuoteItem(router.query.quoteId, updateQuote);
    console.log("resUpdateQuote", resUpdateQuote);
  };

  return (
    <Stack spacing={0} sx={{ mt: 2 }}>
      <AlertDialog
        title={modalPopUp.message.title}
        content={modalPopUp.message.content}
        open={modalPopUp.open}
        handleClose={modalPopUp.handleClose}
      />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Available options
      </Typography>
      <OptionsComponent
        options={selectedProduct?.options}
        handleChange={handleChange}
        selectedOpt={selectedOptions}
      />
      <Grid container justifyContent="center" alignItems="center">
        <Grid md={2}>
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
              setSelectedQuantity(event.target.value);
            }}
          />
        </Grid>
        <Grid md={10}>
          {quoteId && (
            <Button
              variant="contained"
              onClick={() => handleAddQuote()}
              disabled={selectedVariant.currentlyNotInStock ? true : false || notAvilableOption}
              sx={{ mr: 1 }}
            >
              Add to #{quoteId.slice(-4)}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => handleOpenQuoteList()}
            disabled={selectedVariant.currentlyNotInStock ? true : false || notAvilableOption}
          >
            Choose Quote
          </Button>
        </Grid>
      </Grid>
      <Stack
        sx={{ mt: 2 }}
        direction="row"
        spacing={2}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Typography variant="body2">Type: {selectedProduct.productType}</Typography>
        <Typography variant="body2">Vendor: {selectedProduct.vendor}</Typography>
        <Typography variant="body2">Tags: {selectedProduct.tags.map((item) => item)}</Typography>
      </Stack>
    </Stack>
  );
};
