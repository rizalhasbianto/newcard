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
import { filterList } from "src/data/quickAddFilterList";

export const QuickAddProducts = ({ quotesList, setQuotesList }) => {
  const [selectedFilter, setFilter] = useState({
    prodName: "",
    collection: "",
    prodType: "",
    prodVendor: "",
    prodTag: "",
  });
  const [filterOpt, setFilterOpt] = useState();
  const handleFilterChange = useCallback((event) => {
    setFilter({
      ...selectedFilter,
      [event.target.name]:event.target.value
    })
  },[selectedFilter]
  )

  useEffect(() => {
    async function fetchData() {
      const newFilterOpt = {
        collection: [],
        prodType: [],
        prodVendor: [],
        prodTag: [],
      }

      const resCollection = await GetProductsMeta("collections");
      const resProdType = await GetProductsMeta("prodType");
      const resProdVendor = await GetProductsMeta("prodVendor");
      const resProdTag = await GetProductsMeta("prodTag");

      if(resCollection) {
        const orderedCollection = resCollection.newData.data.collections.edges.map((collection) => collection.node.title)
        newFilterOpt.collection = orderedCollection
      }
      if(resProdType) {
        const orderedProdType = resProdType.newData.data.productTypes.edges.map((prodType) => prodType.node && prodType.node)
        newFilterOpt.prodType = orderedProdType
      }
      if(resProdVendor) {
        const orderedProdVendor = resProdVendor.newData.data.shop.productVendors.edges.map((prodVendor) => prodVendor.node && prodVendor.node)
        newFilterOpt.prodVendor = orderedProdVendor
      }
      if(resProdTag) {
        const orderedProdTag = resProdTag.newData.data.productTags.edges.map((prodTag) => prodTag.node && prodTag.node)
        newFilterOpt.prodTag = orderedProdTag
      }
      setFilterOpt(newFilterOpt)
    }

    fetchData();
  }, []);

  return (
    <Box>
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
        {filterList.map((filter) => {
          return (
              filterOpt && 
              <Grid lg={2} key={filter.id}>
              <TextField
                id={filter.id}
                name={filter.id}
                label={filter.title}
                value={selectedFilter[filter.id]}
                select
                fullWidth
                onChange={handleFilterChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {filterOpt[filter.id]?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          );
        })}
      </Grid>
      <Grid lg={12}>
        <Table sx={{ maxWidth: "100%" }}>
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
      </Grid>
    </Box>
  );
};
