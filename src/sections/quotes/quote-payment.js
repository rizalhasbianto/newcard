import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { add, formatISO, format } from "date-fns";
import { paymentOptions } from "src/data/payment-options";
import { useCallback, useEffect, useState } from "react";

export default function PaymentOptions(props) {
  const { setPayment, payment } = props;

  const [date, setDate] = useState();
  const [isNeedDate, setNeedDate] = useState(false);
  const [isFlexibleDate, setFlexibleDate] = useState(false);

  const handleChangeType = useCallback((event) => {
    if(event?.target?.value ) {
      let dateForShopify
      const getPaymentTerm = paymentOptions.find((item) => item.id === event?.target?.value );
      if (getPaymentTerm.dueInDays || getPaymentTerm.paymentTermsType === "FIXED") {
        setNeedDate(true);
        setFlexibleDate(true);
        if (getPaymentTerm.dueInDays) {
          const targetDate = add(new Date(), { days: getPaymentTerm.dueInDays });
          dateForShopify = formatISO(targetDate)
          setDate(formatISO(targetDate));
          setNeedDate(false);
          setFlexibleDate(false);
        }
      } else {
        setDate();
        setNeedDate(false);
      }
      setPayment({
        id: getPaymentTerm.id,
        date: dateForShopify,
        description: getPaymentTerm.description,
        viewDate: dateForShopify && format(new Date(dateForShopify), "MMMM dd yyyy"),
      });
    } else {
      setPayment({
        id: "",
        date: "",
        description: "",
        viewDate: "",
      });
      setNeedDate(false);
    }
    
  }, [setPayment]);

  const handleChangeDate = useCallback((customDate) => {
    const newPayment = {...payment}
    newPayment.date = formatISO(customDate)
    newPayment.viewDate = format(new Date(customDate), "MMMM dd yyyy")
    setPayment(newPayment)
  },[payment, setPayment])

  return (
    <Box
      sx={{
        width: "100%",
        padding: "20px 0",
      }}
    >
      <Typography variant="subtitle1">
        Payment: {payment?.description} {payment?.viewDate && `at ${payment.viewDate}`}
      </Typography>
        <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
          <Grid md={6}>
            <TextField
              id="paymentType"
              name="paymentType"
              label="Term"
              variant="outlined"
              select
              fullWidth
              onChange={handleChangeType}
              value={payment?.id ? payment.id : ""}
            >
              <MenuItem value="">
                  <em>No payment plan</em>
                </MenuItem>
              {paymentOptions.map((item, i) => (
                <MenuItem value={item.id} key={i + 1}>
                  <em>{item.description}</em>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {isNeedDate && (
            <Grid md={6}>
              <DatePicker
                variant="outlined"
                label="Date picker"
                value={date}
                readOnly={!isFlexibleDate}
                renderInput={(params) => <TextField variant="outlined" {...params} />}
                onChange={(newValue) => {
                  setDate(newValue);
                  handleChangeDate(newValue)
                }}
              />
            </Grid>
          )}
        </Grid>
      
    </Box>
  );
}
