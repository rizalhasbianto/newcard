import { useEffect, useState, useCallback } from 'react';
import {
    Typography,
    Box,
    Stack,
    SvgIcon,
    TableRow,
    TableCell,
    Unstable_Grid2 as Grid
} from '@mui/material';
import Image from 'next/image'
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import OptionsComponent from 'src/components/products/options'
import { minHeight } from '@mui/system';

export default function EditProductItem(props) {
    const {
        quote,
        productData,
        key
    } = props
    console.log("quote", quote)
    console.log("productData", productData)
    const [img, setImg] = useState(quote.variant.image.url)
    const [selectedVariant, setSelectedVariant] = useState(quote.variant);
    const [selectedOptions, setSelectedOptions] = useState(quote.variant.selectedOptions.reduce((acc, curr) => (acc[curr.name] = curr.value, acc), {}));
    const [selectedQuantity, setSelectedQuantity] = useState(quote.qty);
    console.log("selectedOptions", selectedOptions)
    const handleChangeOptions = (event, newSingleOption) => {
        console.log("newSingleOption", newSingleOption)
        const getSelectedOption = newSingleOption.split(":")
        const newSelectedOptions = {
            ...selectedOptions,
            [getSelectedOption[0]]: getSelectedOption[1]
        }
        const variants = productData.data.variants.edges
        const newSelecetdVariant = variants.find((variant) => {
            return variant.node.selectedOptions.every((selectedOption) => {
                return newSelectedOptions[selectedOption.name] === selectedOption.value;
            });
        });
        console.log("newSelectedOptions", newSelectedOptions)
        setSelectedOptions(newSelectedOptions);
        setSelectedVariant(newSelecetdVariant?.node)
        setImg(newSelecetdVariant?.node.image.url)
    };

    return (
        <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={key}
        >
            <TableCell sx={{minWidth: "250px"}}>
                <Typography variant='subtitle2'>{quote.productName}</Typography>
                <Grid container>
                    <Grid
                        xs={12}
                        md={6}
                        sx={{
                            position: "relative",
                            minHeight: "100px"
                        }}
                    >
                        <Image
                            src={img}
                            fill={true}
                            alt="Picture of the author"
                            className='shopify-fill'
                            sizes="270 640 750"
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={12}
                    >
                        <OptionsComponent
                            options={productData?.data.options}
                            handleChange={handleChangeOptions}
                            selectedOpt={selectedOptions}
                        />
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell>
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "center"
                    }}
                >
                    {quote.qty}
                </Typography>
            </TableCell>
            <TableCell >
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "center"
                    }}
                >
                    {quote.variant.currentlyNotInStock ? "Out of Stock" : "In Stock"}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "right"
                    }}
                >
                    ${quote.variant.price.amount}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "right"
                    }}
                >
                    ${quote.total}
                </Typography>
            </TableCell>
            <TableCell>
                <Stack
                    justifyContent="center"
                    direction="row"
                    spacing={1}
                >
                    <SvgIcon
                        color="action"
                        fontSize="small"
                        sx={{ "&:hover": { color: "#1c2536", cursor: "pointer" } }}
                    >
                        <EyeIcon />
                    </SvgIcon>
                </Stack>
            </TableCell>
        </TableRow>
    )
}