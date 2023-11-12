import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { paymentOptions } from "src/data/payment-options";
import { useState } from "react";

export default function PaymentOptions(props) {
  const { handleDiscount } = props;
  const [date, setDate] = useState()

  const formik = useFormik({
    initialValues: {
      paymentType: "",
      date: "",
      submit: null,
    },
    validationSchema: Yup.object({
      discountType: Yup.string().required("Discount type is required"),
    }),
    onSubmit: async (values, helpers) => {
      handleDiscount({
        discountType: values.discountType,
        discountAmount: values.discountAmount,
      });
    },
  });
  return (
    <Box
      sx={{
        width: "100%",
        padding: "20px 0",
      }}
    >
      <Typography>Payment</Typography>
      <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
        <Grid md={3}>
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
        <Grid md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              variant="outlined"
              value={date}
              disabled={true}
              renderInput={(params) => <TextField variant="outlined" {...params} />}
              onChange={(newValue) => {
                setDate(newValue);
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid md={3}>
          <Button variant="outlined" onClick={formik.handleSubmit}>
            Add discount
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
