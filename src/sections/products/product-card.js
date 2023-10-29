import { useEffect, useState } from 'react'
import PropTypes from "prop-types";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ClockIcon from "@heroicons/react/24/solid/ClockIcon";
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography, Button, TextField, Unstable_Grid2 as Grid } from "@mui/material";
import Image from "next/image";
import OptionsComponent from "src/components/products/options";
import { ImageComponent } from "src/components/image"

export const ProductCard = (props) => {
  const { product } = props;

  const [selectedVariant, setSelectedVariant] = useState(product.node.variants.edges[0].node);
  const [selectedOptions, setSelectedOptions] = useState(product.node.variants.edges[0].node.selectedOptions.reduce(
    (acc, curr) => ((acc[curr.name] = curr.value), acc),
    {}
  ));
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

  const handleAddQuote = () => {
    const newQuote = {
      productName: product.node.title,
      variant: selectedVariant,
      qty: selectedQuantity,
      total: (selectedQuantity * selectedVariant.price.amount).toFixed(2),
    };
    console.log("prod", product)
  }

  useEffect(() => {
    setSelectedVariant(product.node.variants.edges[0].node)
    setSelectedOptions(product.node.variants.edges[0].node.selectedOptions.reduce(
      (acc, curr) => ((acc[curr.name] = curr.value), acc),
      {}
    ))
  },[product])

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
          <ImageComponent img={img} title={product.node.title}/>
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
<Typography variant="body2">
          Price: ${selectedVariant.price?.amount}
        </Typography>
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
                      <Button
                        variant="contained"
                        onClick={() => handleAddQuote()}
                      >
                        Add to Quote List
                      </Button>
                    </Grid>
                  </Grid>
      </Stack>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
