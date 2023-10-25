import { useCallback, useEffect, useState, Fragment } from "react";
import { GetProductsMeta } from "src/service/use-shopify";
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { 
  Card,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  TableContainer,
  TableRow,
  TextField,
  MenuItem,
  Typography,
  SvgIcon,
  Skeleton,
  Unstable_Grid2 as Grid,
 } from '@mui/material';
import { filterList } from "src/data/quickAddFilterList";

export const ProductsSearch = (props) => {
  const { selectedFilter, setSelectedFilter } = props
  const [filterOpt, setFilterOpt] = useState();

  const handleFilterChange = useCallback(
    async (event) => {
      let newSelectedFilter = selectedFilter;
      if (event) {
        newSelectedFilter = {
          ...selectedFilter,
          [event.target.name]: event.target.value,
        };
      }
      setSelectedFilter(newSelectedFilter);
    },
    [selectedFilter, setSelectedFilter]
  );

  async function fetchData() {
    const newFilterOpt = {
      collection: [],
      prodType: [],
      prodVendor: [],
      prodTag: [],
    };

    const resCollection = await GetProductsMeta("collections");
    const resProdType = await GetProductsMeta("prodType");
    const resProdVendor = await GetProductsMeta("prodVendor");
    const resProdTag = await GetProductsMeta("prodTag");

    if (resCollection) {
      const orderedCollection = resCollection.newData.data.collections.edges.map(
        (collection) => collection.node.handle
      );
      newFilterOpt.collection = orderedCollection;
    }
    if (resProdType) {
      const orderedProdType = resProdType.newData.data.productTypes.edges.map(
        (prodType) => prodType.node && prodType.node
      );
      newFilterOpt.prodType = orderedProdType;
    }
    if (resProdVendor) {
      const orderedProdVendor = resProdVendor.newData.data.shop.productVendors.edges.map(
        (prodVendor) => prodVendor.node && prodVendor.node
      );
      newFilterOpt.prodVendor = orderedProdVendor;
    }
    if (resProdTag) {
      const orderedProdTag = resProdTag.newData.data.productTags.edges.map(
        (prodTag) => prodTag.node && prodTag.node
      );
      newFilterOpt.prodTag = orderedProdTag;
    }
    setFilterOpt(newFilterOpt);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
  <Card 
    sx={{ 
      p: 2,
      position: "sticky",
      top: "20px",
      zIndex: "3"
    }}
  >
    <Grid container spacing={2}>
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
        {!filterOpt ? (
          <Skeleton
            variant="rectangular"
            width={162}
            height={55}
            sx={{ marginTop: "12px", borderRadius: "5px" }}
          />
        ) : (
          filterList.map((filter) => {
            return (
              filterOpt && (
                <Grid lg={2} key={filter.id}>
                  <TextField
                    id={filter.id}
                    name={filter.id}
                    label={filter.title}
                    value={selectedFilter[filter.id]}
                    select
                    fullWidth
                    onChange={handleFilterChange}
                    sx={{ maxHeight: 250 }}
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
              )
            );
          })
        )}
      </Grid>
  </Card>
  )
};
