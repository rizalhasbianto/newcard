import { useCallback, useEffect, useState, Fragment } from "react";
import { GetProductsMeta } from "src/service/use-shopify";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Card,
  Box,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  TableContainer,
  TableRow,
  TextField,
  MenuItem,
  Typography,
  SvgIcon,
  Skeleton,
  Button,
  Collapse,
  Checkbox,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { filterList } from "src/data/quickAddFilterList";
import { variantFilters } from "src/data/variantFilters";
import { Stack } from "@mui/system";

export const ProductsSearch = (props) => {
  const { selectedFilter, setSelectedFilter } = props;
  const [selectedVariantFilter, setSelectedVariantFilter] = useState([]);
  const [filterOpt, setFilterOpt] = useState();
  const [isVariantFilters, setIsVariantFilters] = useState(false);

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

  // PRODUCT SEARCH AND VARIANT FILTER

  const handleVariantFilterChange = (event) => {
    const splitVal = event.target.name.split("|-|");

    const newData = {
      name:splitVal[0],
      value:[splitVal[1]]
    }
    const isHaveSameFilter = selectedVariantFilter.findIndex((n) => n.name === splitVal[0])
    if(isHaveSameFilter < 0) {
      setSelectedVariantFilter(
        [
          ...selectedVariantFilter,
          newData
        ]
      )
    } else {
      const oldFilterVal = [...selectedVariantFilter]
      const isHaveSameFilterVal = oldFilterVal[isHaveSameFilter].value.findIndex((val) => val === splitVal[1])
      if(isHaveSameFilterVal < 0) {
        const newDataSameFilter = {
          name:splitVal[0],
          value:[...oldFilterVal[isHaveSameFilter].value, splitVal[1]]
        }
        oldFilterVal[isHaveSameFilter] = newDataSameFilter
        setSelectedVariantFilter(oldFilterVal)
      } else {
        const newVal = oldFilterVal[isHaveSameFilter].value;
        newVal.splice(isHaveSameFilterVal, 1)
        const newDataSameFilter = {
          name:splitVal[0],
          value:newVal
        }
        oldFilterVal[isHaveSameFilter] = newDataSameFilter
        setSelectedVariantFilter(oldFilterVal)
      }
    }
    
  };
  return (
    <Card
      sx={{
        p: 2,
        position: "sticky",
        top: "20px",
        zIndex: "3",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid lg={1} justifyItems="flex-end">
          <Button
            startIcon={
              <SvgIcon fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            }
            variant="contained"
            size="small"
            sx={{ width: "100%" }}
            onClick={() => setIsVariantFilters(!isVariantFilters)}
          >
            Variant
          </Button>
        </Grid>
        <Grid lg={3}>
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
      <Collapse in={isVariantFilters}>
        <Box sx={{ display: "block", overflow: "auto" }}>
          <Box sx={{ display: "block", width: "max-content" }}>
            {variantFilters.map((variant) => {
               const selectedFilter = selectedVariantFilter.find((varFilter) => varFilter.name === variant.name)
              return (
                <FormControl
                  sx={{ m: 3 }}
                  component="fieldset"
                  variant="standard"
                  key={variant.name}
                >
                  <FormLabel component="legend">{variant.name}</FormLabel>
                  <FormGroup
                    sx={{
                      display: "block",
                      maxHeight: "300px",
                      overflow: "auto",
                    }}
                  >
                    {variant.values.map((varVal, i) => {
                      const isHaveVal = selectedFilter ? selectedFilter.value.includes(varVal) : false
                      return (
                        <FormControlLabel
                          key={i + 1}
                          control={
                            <Checkbox
                              checked={isHaveVal}
                              onChange={handleVariantFilterChange}
                              name={`${variant.name}|-|${varVal}`}
                            />
                          }
                          label={varVal}
                          sx={{
                            display: "block",
                            width: "max-content",
                          }}
                        />
                      );
                    })}
                  </FormGroup>
                </FormControl>
              );
            })}
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};
