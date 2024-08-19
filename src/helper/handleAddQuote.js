export const addQuote = (props) => {
  const {
    quotesList,
    setQuotesList,
    selectedProduct,
    selectedVariant,
    selectedQuantity,
    modalPopUp,
    handleSubmit
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
    const updatedQuote = [...quotesList];
    setQuotesList(updatedQuote);
    //handleSubmit({quotesListData:updatedQuote})
    return;
  }

  const currentQuote = [...quotesList];
  const newQuote = {
    productID: selectedProduct.node.id,
    productName: selectedProduct.node.title,
    variant: selectedVariant,
    qty: selectedQuantity,
  };
  currentQuote.push(newQuote);
  setQuotesList(currentQuote);
  handleSubmit({quotesListData:currentQuote})
};
