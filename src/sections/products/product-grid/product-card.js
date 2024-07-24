import { useEffect, useState } from "react";
import Link from "next/link";
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
  Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import OptionsComponent from "src/components/products/options";
import { ImageComponent } from "src/components/image";
import { UpdateQuoteItem } from "src/service/use-mongo";

const ProductCard = (props) => {
  const { product, handleOpenQuoteList, catalogCompany, toastUp, quoteId, session } = props;

  const [buttonloading, setButtonloading] = useState(false);
  const [notAvilableOption, setNotAvilableOption] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.node.variants.edges[0].node);
  const [selectedOptions, setSelectedOptions] = useState(
    product.node.variants.edges[0].node.selectedOptions.reduce(
      (acc, curr) => ((acc[curr.name] = curr.value), acc),
      {}
    )
  );
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const img = selectedVariant?.image?.url;

  const handleChange = (event, newSingleOption) => {
    if (!newSingleOption) return;
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
    if (newSelecetdVariant) {
      setNotAvilableOption(false);
      setSelectedVariant(newSelecetdVariant?.node);
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
      productName: product.node.title,
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
      <CardContent sx={{ p: "10px 20px 10px" }}>
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
          <Link
            href={`/products/${product.node.handle}${quoteId ? `?quoteId=${quoteId}` : ""}`}
            sx={{ position: "relative" }}
          >
            <ImageComponent img={img} title={product.node.title} />
          </Link>
        </Box>
        <Link href={`/products/${product.node.handle}${quoteId ? `?quoteId=${quoteId}` : ""}`}>
          <Typography align="center" gutterBottom variant="h6">
            {product.node.title}
          </Typography>
        </Link>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{ p: 0 }}
        >
          <Box sx={{ display: "flex" }}>
            {session.user.detail.role === "customer" &&
            catalogCompany &&
            catalogCompany.length > 0 ? (
              <>
                <Typography variant="body2">Price: </Typography>
                <Typography variant="body2" sx={{ textDecoration: "line-through" }}>
                  ${selectedVariant.price?.amount}
                </Typography>
                <Typography variant="body2"> / </Typography>
                {catalogCompany.map((company, index) => {
                  const companyPrice = selectedVariant.companyPrice.node[`company_${company.id}`];
                  return (
                    <Typography
                      variant="body2"
                      key={index + 1}
                      sx={{ fontWeight: 600, textTransform: "capitalize" }}
                    >
                      ${companyPrice.price.amount}
                    </Typography>
                  );
                })}
              </>
            ) : (
              <Typography variant="body2">Price: ${selectedVariant.price?.amount}</Typography>
            )}
          </Box>
          <Typography variant="body2">
            Stock: {selectedVariant.currentlyNotInStock ? "Out of stock" : "In stock"}
          </Typography>
        </Stack>
        {session.user.detail.role !== "customer" && catalogCompany && catalogCompany.length > 0 && (
          <Divider sx={{ mt: 1, mb: 1 }} />
        )}
        <Box>
          {session.user.detail.role !== "customer" &&
            catalogCompany &&
            catalogCompany.length > 0 &&
            catalogCompany.map((company, index) => {
              const companyPrice = selectedVariant.companyPrice.node[`company_${company.id}`];
              return (
                <Typography
                  variant="body2"
                  key={index + 1}
                  sx={{ fontWeight: 600, textTransform: "capitalize" }}
                >
                  {company.name} Price: ${companyPrice.price.amount}
                </Typography>
              );
            })}
        </Box>
      </CardContent>
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: "20px" }}
      >
        <OptionsComponent
          options={product.node.options}
          handleChange={handleChange}
          selectedOpt={selectedOptions}
        />
      </Stack>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      {notAvilableOption && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          No variant available for this selected options!
        </Typography>
      )}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ p: "20px" }}
      >
        <TextField
          id="qtySingle"
          label="Quantity"
          variant="outlined"
          InputProps={{ inputProps: { min: 1 } }}
          type="number"
          sx={{
            mt: "10px",
            mb: "10px",
            maxWidth: "70px",
          }}
          value={selectedQuantity}
          onChange={(event) => {
            setSelectedQuantity(event.target.value);
          }}
        />
        {!quoteId ? (
          <Button
            variant="contained"
            onClick={() => handleOpenQuoteList()}
            disabled={selectedVariant.currentlyNotInStock ? true : false || notAvilableOption}
          >
            Choose Quote
          </Button>
        ) : (
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
      </Stack>
    </Card>
  );
};

export default ProductCard;
