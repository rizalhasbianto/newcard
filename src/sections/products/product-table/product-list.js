import { useEffect, useState } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  TableCell,
  TableRow,
  Divider,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import OptionsComponent from "src/components/products/options";
import { ImageComponent } from "src/components/image";
import { UpdateQuoteItem } from "src/service/use-mongo";

const Productlist = (props) => {
  const { product, handleOpenQuoteList, catalogCompany, toastUp, noUrut, quoteId, session } = props;
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

  const isSingleOptions = product.node.options.find((itm) =>
    itm.values.includes("Default Title")
  );

  return (
    <TableRow hover>
      <TableCell padding="checkbox">{noUrut}</TableCell>
      <TableCell>
        <Grid container justifyContent="flex-start">
          <Grid lg={4}>
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
                href={`/dashboard/products/${product.node.handle}${quoteId ? `?quoteId=${quoteId}` : ""}`}
              >
                <ImageComponent img={img} title={product.node.title} />
              </Link>
            </Box>
          </Grid>
          <Grid lg={8}>
            <Link href={`/dashboard/products/${product.node.handle}${quoteId ? `?quoteId=${quoteId}` : ""}`}>
              <Typography align="left" gutterBottom variant="h6">
                {product.node.title}
              </Typography>
            </Link>
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={2}
              sx={{ p: 2 }}
            >
              {notAvilableOption && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  No variant available for this selected options!
                </Typography>
              )}
              <OptionsComponent
                options={product.node.options}
                handleChange={handleChange}
                selectedOpt={selectedOptions}
                isSingleOptions={isSingleOptions}
              />
            </Stack>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>
      {session.user.detail.role === "customer" &&
            catalogCompany &&
            catalogCompany.length > 0 ? (
              <>
                {catalogCompany.map((company, index) => {
                  const companyPrice = selectedVariant.companyPrice.node[`company_${company.id}`];
                  return (
                    <>
                      <Typography
                        variant="body2"
                        sx={
                          Number(selectedVariant.price?.amount) >
                            Number(companyPrice.price.amount) && { textDecoration: "line-through" }
                        }
                      >
                        ${selectedVariant.price?.amount}
                      </Typography>
                      {Number(selectedVariant.price?.amount) >
                        Number(companyPrice.price.amount) && (
                        <>
                          <Typography variant="body2"> - </Typography>
                          <Typography
                            variant="body2"
                            key={index + 1}
                            sx={{ fontWeight: 600, textTransform: "capitalize" }}
                          >
                            ${companyPrice.price.amount}
                          </Typography>
                        </>
                      )}
                    </>
                  );
                })}
              </>
            ) : (
              <Typography variant="body2">Price: ${selectedVariant.price?.amount}</Typography>
            )}
        {session.user.detail.role !== "customer" && catalogCompany && catalogCompany.length > 0 && (
          <Divider sx={{ mt: 1, mb: 1 }} />
        )}
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
      </TableCell>
      <TableCell sx={{ minWidth: "150px" }} align="center">
        <Typography variant="body2">
          {selectedVariant.currentlyNotInStock ? "Out of stock" : "In stock"}
        </Typography>
      </TableCell>
      <TableCell padding="checkbox">
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
      </TableCell>
      <TableCell sx={{ minWidth: "250px" }} align="center">
        {!quoteId ? (
          <Button variant="contained" onClick={() => handleOpenQuoteList()}>
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
          >
            Add to #{quoteId.slice(-4)}
          </LoadingButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default Productlist;
