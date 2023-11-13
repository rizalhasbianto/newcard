import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  Unstable_Grid2 as Grid,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { add, formatISO, format } from 'date-fns'
import { paymentOptions } from "src/data/payment-options";
import { useEffect, useState } from "react";

export default function PaymentOptions(props) {
  const { handlePayment, payment } = props;
  const [date, setDate] = useState();
  const [isNeedDate, setNeedDate] = useState(false);
  const [isFlexibleDate, setFlexibleDate] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(false);

  const formik = useFormik({
    initialValues: {
      paymentType: "",
      date: "",
      submit: null,
    },
    validationSchema: Yup.object({
      paymentType: Yup.string().required("Discount type is required"),
    }),
    onSubmit: (values, helpers) => {
      const getPaymentTerm = paymentOptions.find((item) => item.id === formik.values.paymentType)
      console.log("getPaymentTerm", getPaymentTerm)
      setSelectedPayment({
        type:getPaymentTerm.description,
        date:format(new Date(date), 'MMMM dd yyyy')
      })
      handlePayment({
        type: values.paymentType,
        date: date,
      });
    },
  });

useEffect(() => {
  if(formik.values.paymentType) {
    const getPaymentTerm = paymentOptions.find((item) => item.id === formik.values.paymentType)
    if(getPaymentTerm.dueInDays || getPaymentTerm.paymentTermsType === "FIXED") {
      setNeedDate(true)
      setFlexibleDate(true)
      if(getPaymentTerm.dueInDays) {
        const targetDate = add(new Date(), {days:getPaymentTerm.dueInDays})
        setDate(formatISO(targetDate))
        setFlexibleDate(false)
      }
    } else {
      setDate()
      setNeedDate(false)
    }
  }
  
},[formik.values])
console.log("payment", payment)
  return (
    <Box
      sx={{
        width: "100%",
        padding: "20px 0",
      }}
    >
      <Typography variant="subtitle1">Payment: {selectedPayment?.type} {selectedPayment.date && `at ${selectedPayment.date}`}</Typography>
      {
        !selectedPayment &&

      
      <Grid 
        container 
        spacing={2} 
        direction="row" 
        justifyContent="flex-start" 
        alignItems="center"
      >
        <Grid md={6}>
          <TextField
            id="paymentType"
            name="paymentType"
            label="Type"
            variant="outlined"
            select
            fullWidth
            error={!!(formik.touched.paymentType && formik.errors.paymentType)}
            helperText={formik.touched.paymentType && formik.errors.paymentType}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.paymentType}
          >
            {paymentOptions.map((item, i) => (
              <MenuItem value={item.id} key={i + 1}>
                <em>{item.description}</em>
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
          {
            isNeedDate &&
            <Grid md={6}>
            <DatePicker
              variant="outlined"
              value={date}
              disabled={!isFlexibleDate}
              renderInput={(params) => <TextField variant="outlined" {...params} />}
              onChange={(newValue) => {
                setDate(newValue);
              }}
            />
            </Grid>
          }
      </Grid>
}
    </Box>
  );
}
