import { useCallback, useRef, useState, useMemo } from 'react';
import { ClientRequest } from 'src/lib/ClientRequest'

export function usePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
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

  const handleGetProduct = useCallback( async(productId, index) => {
    const res = await ClientRequest(
      "/api/shopify/get-single-product",
      "POST",
      {
        id: productId,
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
    open,
    message,
    productData
  };
}
