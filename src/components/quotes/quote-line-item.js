import {
  Typography,
  Box,
  Stack,
  SvgIcon,
  TableRow,
  TableCell,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import Image from "next/image";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";

export default function QuoteLineItem(props) {
  const { quote, handleOpenProd, handleEditLineitem, handleDeleteProd, index } = props;
  const price = quote.variant.price.amount !== quote.variant.companyPrice.node
  return (
    <TableRow 
        hover 
        role="checkbox" 
        tabIndex={-1} 
        key={index + 1}
    >
      <TableCell>
        <Typography variant="subtitle2">{quote.productName}</Typography>
        <Grid container>
          <Grid
            xs={12}
            md={4}
            sx={{
              position: "relative",
            }}
          >
            {quote.variant.image && (
              <Image
                src={quote.variant.image?.url}
                fill={true}
                alt="Picture of the author"
                className="shopify-fill"
                sizes="270 640 750"
              />
            )}
          </Grid>
          <Grid xs={12} md={8}>
            {quote.variant.selectedOptions.map((opt) => {
              return (
                <Typography
                  key={opt.name}
                  variant="body3"
                  sx={{
                    display: "block",
                    whiteSpace: "nowrap",
                  }}
                >
                  {opt.name} : {opt.value}
                </Typography>
              );
            })}
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
          }}
        >
          {quote.qty}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
          }}
        >
          {quote.variant.currentlyNotInStock ? "Out of Stock" : "In Stock"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            textAlign: "right",
          }}
        >
          ${quote.variant.price.amount}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            textAlign: "right",
          }}
        >
          ${quote.total}
        </Typography>
      </TableCell>
      <TableCell>
        <Stack justifyContent="center" direction="row" spacing={1}>
          <SvgIcon
            color="action"
            fontSize="small"
            sx={{ "&:hover": { color: "#1c2536", cursor: "pointer" } }}
            onClick={() => handleOpenProd(quote.variant)}
          >
            <EyeIcon />
          </SvgIcon>
          <SvgIcon
            color="action"
            fontSize="small"
            sx={{ "&:hover": { color: "#1c2536", cursor: "pointer" } }}
            onClick={() => handleEditLineitem(quote.variant, index)}
          >
            <PencilIcon />
          </SvgIcon>
          <SvgIcon
            color="action"
            fontSize="small"
            sx={{ "&:hover": { color: "#1c2536", cursor: "pointer" } }}
            onClick={() => handleDeleteProd(index)}
          >
            <TrashIcon />
          </SvgIcon>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
