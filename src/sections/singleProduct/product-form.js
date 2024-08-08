/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import OptionsComponent from "src/components/products/options";
import AlertDialog from "src/components/alert-dialog";
import { usePopover } from "src/hooks/use-popover";
import {
  Button,
  TextField,
  Typography,
  Stack,
  Divider,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ProductAlertDialogQuoteList from "src/sections/products/product-alert-dialog-quotelist";

import { GetQuotesData, UpdateQuoteItem } from "src/service/use-mongo";

export const ProductFrom = (props) => {
  const { selectedProduct, setSelectedImgVariant, setSelectedTab, quoteId, toastUp, session } =
    props;

  const [buttonloading, setButtonloading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [notAvilableOption, setNotAvilableOption] = useState(false);
  const [openQuote, setOpenQuote] = useState(false);
  const [quoteList, setQuoteList] = useState(false);
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
    if (!newSingleOption) return;
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
    if (!quoteId) {
      return;
    }
    setButtonloading(true);
    const updateQuote = {
      productName: selectedProduct.title,
      variant: selectedVariant,
      qty: selectedQuantity,
      total: (selectedQuantity * selectedVariant.price.amount).toFixed(2),
    };

    const resUpdateQuote = await UpdateQuoteItem(quoteId, updateQuote);
    if (resUpdateQuote) {
      toastUp.handleStatus("success");
      toastUp.handleMessage("Product added to quote!!!");
    } else {
      toastUp.handleStatus("error");
      toastUp.handleMessage("Error add product to quote!!!");
    }

    setButtonloading(false);
  };

  const handleOpenQuoteList = useCallback(async () => {
    const quoteQuery = {
      $or: [{ status: "draft" }, { status: "new" }],
      createdBy: session?.user?.detail?.company.companyName,
    };
    const sort = "DSC";
    const resQuotes = await GetQuotesData(0, 50, quoteQuery, sort);
    if (!resQuotes) {
      toastUp.handleStatus("error");
      toastUp.handleMessage("Error when get quote list!!!");
      return;
    }
    setQuoteList(resQuotes.data.quote);
    setOpenQuote(true);
  }, []);

  const isSingleOptions = selectedProduct?.options.find((itm) =>
    itm.values.includes("Default Title")
  );

  return (
    <Stack spacing={0} sx={{ mt: 2 }}>
      <ProductAlertDialogQuoteList
        openQuote={openQuote}
        setOpenQuote={setOpenQuote}
        quoteList={quoteList}
      />
      <AlertDialog
        title={modalPopUp.message.title}
        content={modalPopUp.message.content}
        open={modalPopUp.open}
        handleClose={modalPopUp.handleClose}
      />
      {!isSingleOptions && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          Available options
        </Typography>
      )}
      <OptionsComponent
        options={selectedProduct?.options}
        handleChange={handleChange}
        selectedOpt={selectedOptions}
        isSingleOptions
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
            <LoadingButton
              color="primary"
              disabled={selectedVariant.currentlyNotInStock ? true : false || notAvilableOption}
              onClick={() => handleAddQuote()}
              loading={buttonloading ? true : false}
              loadingPosition="start"
              startIcon={<RequestQuoteIcon />}
              variant="contained"
              sx={{ mr: 2 }}
            >
              Add to #{quoteId.slice(-4)}
            </LoadingButton>
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
