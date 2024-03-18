export const addQuote = (props) => {
  const {
    quotesList,
    setQuotesList,
    selectedProduct,
    selectedVariant,
    selectedQuantity,
    modalPopUp,
  } = props;

  if (selectedVariant.currentlyNotInStock) {
    modalPopUp.handleContent(
      "Out Of Stock",
      "Unfortunately, the following item(s) that you ordered are now out-of-stock!"
    );
    modalPopUp.handleOpen();
    return;
  }

  const findProdOnList = quotesList.findIndex((prod) => prod.variant.sku === selectedVariant.sku);
  if (findProdOnList >= 0) {
    const totalQty = parseInt(quotesList[findProdOnList].qty) + parseInt(selectedQuantity);
    quotesList[findProdOnList].qty = totalQty;
    quotesList[findProdOnList].total = (totalQty * quotesList[findProdOnList].variant.price.amount).toFixed(2);
    const updatedQuote = [...quotesList];
    setQuotesList(updatedQuote);0
    return;
  }

  const currentQuote = [...quotesList];
  const newQuote = {
    productName: selectedProduct.node.title,
    variant: selectedVariant,
    qty: selectedQuantity,
    total: (selectedQuantity * selectedVariant.price.amount).toFixed(2),
  };
  currentQuote.push(newQuote);
  setQuotesList(currentQuote);
};
