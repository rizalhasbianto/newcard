import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  Button,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import OptionsComponent from "src/components/products/options";
import { ImageComponent } from "src/components/image";
import { useRouter } from "next/router";
import { UpdateQuoteItem } from "src/service/use-mongo";

export const ProductCard = (props) => {
  const { product, handleOpenQuoteList } = props;
  const router = useRouter();
  const quoteId = router.query?.quoteId;

  const [selectedVariant, setSelectedVariant] = useState(product.node.variants.edges[0].node);
  const [selectedOptions, setSelectedOptions] = useState(
    product.node.variants.edges[0].node.selectedOptions.reduce(
      (acc, curr) => ((acc[curr.name] = curr.value), acc),
      {}
    )
  );
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const img = selectedVariant.image?.url;

  const handleChange = (event, newSingleOption) => {
    const getSelectedOption = newSingleOption.split(":");
    const newSelectedOptions = {
      ...selectedOptions,
      [getSelectedOption[0]]: getSelectedOption[1],
    };
    const variants = product.node.variants.edges;
    const newSelecetdVariant = variants.find((variant) => {
      return variant.node.selectedOptions.every((selectedOption) => {
        return newSelectedOptions[selectedOption.name] === selectedOption.value;
      });
    });
    setSelectedOptions(newSelectedOptions);
    setSelectedVariant(newSelecetdVariant?.node);
  };

  const handleAddQuote = async () => {
    if (!router.query.quoteId) {
      return;
    }

    const updateQuote = {
      productName: product.node.title,
      variant: selectedVariant,
      qty: selectedQuantity,
      total: (selectedQuantity * selectedVariant.price.amount).toFixed(2),
    };

    const resUpdateQuote = await UpdateQuoteItem(router.query.quoteId, updateQuote);
    console.log("resUpdateQuote", resUpdateQuote);
  };

  useEffect(() => {
    setSelectedVariant(product.node.variants.edges[0].node);
    setSelectedOptions(
      product.node.variants.edges[0].node.selectedOptions.reduce(
        (acc, curr) => ((acc[curr.name] = curr.value), acc),
        {}
      )
    );
  }, [product]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pb: 3,
            position: "relative",
            height: "200px",
            marginBottom: "20px",
          }}
        >
          <ImageComponent img={img} title={product.node.title} />
        </Box>
        <Typography align="center" gutterBottom variant="h5">
          {product.node.title}
        </Typography>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{ p: 2 }}
        >
          <Typography variant="body2">Price: ${selectedVariant.price?.amount}</Typography>
          <Typography variant="body2">
            Stock: {selectedVariant.currentlyNotInStock ? "Out of stock" : "In stock"}
          </Typography>
        </Stack>
      </CardContent>
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <OptionsComponent
          options={product.node.options}
          handleChange={handleChange}
          selectedOpt={selectedOptions}
        />
      </Stack>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Grid container justifyContent="center" alignItems="center">
          <Grid xs={12} md={4}>
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
          <Grid xs={12} md={8}>
            {!quoteId ? (
              <Button variant="contained" onClick={() => handleOpenQuoteList()}>
                Choose Quote
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => handleAddQuote()}
                disabled={selectedVariant.currentlyNotInStock ? true : false}
              >
                Add to #{quoteId.slice(-4)}
              </Button>
            )}
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};