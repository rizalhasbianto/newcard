import {
    Box,
    Button,
    TextField,
    MenuItem,
    InputAdornment,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function DiscountLine(props) {
    const { handleDiscount } = props

    const formik = useFormik({
        initialValues: {
            discountType: '',
            discountAmount: '',
            submit: null
        },
        validationSchema: Yup.object({
            discountType: Yup.string().required('Discount type is required'),
            discountAmount: Yup.string().required('Discount amount is required')
        }),
        onSubmit: async (values, helpers) => {
            handleDiscount({
                discountType: values.discountType,
                discountAmount: values.discountAmount
            })
        }
    });
    return (
        <Box
            sx={{
                width: "100%",
                padding: "20px 0"
            }}>
            <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
            >
                <Grid md={3}>
                    <TextField
                        id="discountType"
                        name="discountType"
                        label="Type"
                        variant="outlined"
                        select
                        fullWidth
                        error={!!(formik.touched.discountType && formik.errors.discountType)}
                        helperText={formik.touched.discountType && formik.errors.discountType}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.discountType}
                    >
                        <MenuItem value="FIXED_AMOUNT">
                            <em>Fixed($)</em>
                        </MenuItem>
                        <MenuItem value="PERCENTAGE">
                            <em>Percent(%)</em>
                        </MenuItem>
                    </TextField>
                </Grid>
                <Grid md={3}>
                    <TextField
                        id="discountAmount"
                        name="discountAmount"
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    {formik?.values?.discountType === "FIXED_AMOUNT" ? "$" : "%"}
                                </InputAdornment>,
                        }}
                        error={!!(formik.touched.discountAmount && formik.errors.discountAmount)}
                        helperText={formik.touched.discountAmount && formik.errors.discountAmount}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.discountAmount}
                    />
                </Grid>
                <Grid md={3}>
                    <Button
                        variant="outlined"
                        onClick={formik.handleSubmit}
                    >
                        Add discount
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}