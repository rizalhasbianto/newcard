import { useCallback, useRef, useState, useMemo } from 'react';
import { useDataService } from 'src/lib/fetchData'

export function usePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState('');
  const [productData, setProductData] = useState('');
  
  const handleOpen = useCallback(() => { 
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setMessage("")
  }, []);

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleContent = useCallback((title, content) => {
    setMessage({
      title,
      content
    });
  }, []);

  const handleContinue = useCallback((agree) => {
    setAgree(agree)
  }, []);

  const handleGetProduct = useCallback( async(productId, shopifyCompanyLocationID, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const res = await useDataService(
      "/api/product/get-single-product",
      "POST",
      {
        id: productId,
        shopifyCompanyLocationID: shopifyCompanyLocationID
      }
    )
    
    if (!res || res.newData.errors ) {
      console.log("Failed feth product data!")
      setProductData({
        status: "error",
        message: "Failed fetch product data!"
      })
      return 
    }

    setProductData({
      status: "success",
      data: res.newData.data.product,
      index: index
    })
  }, []);

  return {
    anchorRef,
    handleClose,
    handleOpen,
    handleToggle,
    handleContent,
    handleGetProduct,
    handleContinue,
    open,
    message,
    productData,
    agree
  };
}
