import { useCallback, useRef, useState } from 'react';

export function usePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleOpen = useCallback(() => {
    console.log("test run")
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

  return {
    anchorRef,
    handleClose,
    handleOpen,
    handleToggle,
    handleContent,
    open,
    message
  };
}
