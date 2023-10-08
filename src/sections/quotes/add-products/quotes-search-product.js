/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image'
import OptionsComponent from 'src/components/products/options'
import AlertDialog from 'src/components/alert-dialog'
import { usePopover } from 'src/hooks/use-popover';
import {
  Box,
  Button,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const SearchProduct = (props) => {
  const { quotesList, setQuotesList, selectedProduct } = props
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const modalPopUp = usePopover();

  useEffect(() => {
    if (!selectedProduct) return undefined;
    const selectedVar = selectedProduct.node.variants.edges[0].node;
    const selectedOpt = selectedVar.selectedOptions.reduce(
      (acc, curr) => ((acc[curr.name] = curr.value), acc),
      {}
    );
    setSelectedVariant(selectedVar);
    setSelectedOptions(selectedOpt);
  }, [selectedProduct]);

  const handleChange = (event, newSingleOption) => {
    const getSelectedOption = newSingleOption.split(":")
    const newSelectedOptions = {
      ...selectedOptions,
      [getSelectedOption[0]]: getSelectedOption[1]
    }
    const variants = selectedProduct.node.variants.edges
    const newSelecetdVariant = variants.find((variant) => {
      return variant.node.selectedOptions.every((selectedOption) => {
        return newSelectedOptions[selectedOption.name] === selectedOption.value;
      });
    });
    setSelectedOptions(newSelectedOptions);
    setSelectedVariant(newSelecetdVariant?.node)
  };

  const handleAddQuote = useCallback(
    () => {
      if (selectedVariant.currentlyNotInStock) {
        modalPopUp.handleContent(
          "Out Of Stock",
          "Unfortunately, the following item(s) that you ordered are now out-of-stock!"
        );
        modalPopUp.handleOpen();
        return
      }

      const findProdOnList = quotesList.findIndex((prod) => prod.variant.sku === selectedVariant.sku)
      if (findProdOnList >= 0) {
        const totalQty = parseInt(quotesList[findProdOnList].qty) + parseInt(selectedQuantity)
        quotesList[findProdOnList].qty = totalQty
        quotesList[findProdOnList].total = totalQty * quotesList[findProdOnList].variant.price.amount
        const oldQuote = [...quotesList]
        setQuotesList(oldQuote)
        return
      }

      const oldQuote = [...quotesList]
      const newQuote = {
        productName: selectedProduct.node.title,
        variant: selectedVariant,
        qty: selectedQuantity,
        total: (selectedQuantity * selectedVariant.price.amount).toFixed(2)
      }
      oldQuote.push(newQuote)
      setQuotesList(oldQuote)
    }
  )

  return (
    <>
      <AlertDialog
        title={modalPopUp.message.title}
        content={modalPopUp.message.content}
        open={modalPopUp.open}
        handleClose={modalPopUp.handleClose}
      />
      <Grid
        container
        spacing={3}
      >
        <Grid
          xs={12}
          md={5}
        >
          <OptionsComponent
            options={selectedProduct?.node.options}
            handleChange={handleChange}
            selectedOpt={selectedOptions}
          />
        </Grid>
        <Grid
          xs={12}
          md={7}
        >
          {selectedVariant &&
            <Box>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={5}
                  sx={{
                    position: "relative"
                  }}
                >

                  <Image
                    src={selectedVariant.image.url}
                    fill={true}
                    alt="Picture of the author"
                    className='shopify-fill'
                    sizes="270 640 750"
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={7}
                >
                  <Typography
                    variant="body2"
                  >
                    Price: ${selectedVariant.price.amount}
                  </Typography>
                  <Typography
                    variant="body2"
                  >
                    Stock: {selectedVariant.currentlyNotInStock ? "Out of stock" : "In stock"}
                  </Typography>
                  <Typography
                    variant="body2"
                  >
                    Sku: {selectedVariant.sku}
                  </Typography>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid
                      xs={12}
                      md={4}
                    >
                      <TextField
                        id="qtySingle"
                        label="Quantity"
                        variant="outlined"
                        InputProps={{ inputProps: { min: 1 } }}
                        type="number"
                        sx={{
                          mt: '10px',
                          mb: '10px'
                        }}
                        value={selectedQuantity}
                        onChange={(event) => {
                          setSelectedQuantity(event.target.value);
                        }}
                      />
                    </Grid>
                    <Grid
                      xs={12}
                      md={8}
                    >
                      <Button
                        variant="contained"
                        onClick={handleAddQuote}
                      >
                        Add to Quote List
                      </Button>
                    </Grid>
                  </Grid>


                </Grid>
              </Grid>

            </Box>
          }
        </Grid>
      </Grid>
    </>
  );
}