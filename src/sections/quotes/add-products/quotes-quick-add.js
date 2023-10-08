import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  MenuItem,
  Typography,
  SvgIcon,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Scrollbar } from "src/components/scrollbar";
import { quotesQuickAddHead } from "src/data/tableList";
import { GetProductsMeta } from "src/service/use-shopify";

export const QuickAddProducts = ({ quotesList, setQuotesList }) => {
  const [selectedFilter, setFilter] = useState({
    selectedProdName: "",
    selectedCollection: "",
    selectedProdType: "",
    selectedProdVendor: "",
    selectedProdTag: "",
  });
  const [filterOpt, setFilterOpt] = useState({
    collection: [],
    prodType: [],
    prodVendor: [],
    prodTag: [],
  });

  const handleFilterChange = useCallback((event) => {
    console.log(event.target);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const resCollection = await GetProductsMeta("collections");
      const resprodType = await GetProductsMeta("prodType");
      const prodVendor = await GetProductsMeta("prodVendor");
      const prodTag = await GetProductsMeta("prodTag");
    }
    fetchData();
  }, []);

  return (
    <Scrollbar>
      <Box sx={{ minWidth: 800 }}>
        <Grid container>
          <Grid lg={4}>
            <TextField
              id="prodName"
              name="prodName"
              label="Product Name"
              value={selectedFilter.selectedProdName}
              fullWidth
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid lg={2}>
            <TextField
              id="collection"
              name="collection"
              label="Collection"
              value={selectedFilter.selectedCollection}
              select
              fullWidth
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filterOpt.collection?.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid lg={2}>
            <TextField
              id="prodType"
              name="prodType"
              label="Product Type"
              value={selectedFilter.selectedProdType}
              select
              fullWidth
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filterOpt.prodType?.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid lg={2}>
            <TextField
              id="prodVendor"
              name="prodVendor"
              label="Product Vendor"
              value={selectedFilter.selectedProdVendor}
              select
              fullWidth
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filterOpt.prodVendor?.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid lg={2}>
            <TextField
              id="prodTag"
              name="prodRag"
              label="Product Tag"
              value={selectedFilter.selectedProdTag}
              select
              fullWidth
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filterOpt.prodTag?.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              {quotesQuickAddHead.map((head) => {
                return <TableCell key={head.title}>{head.title}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </Box>
    </Scrollbar>
  );
};
