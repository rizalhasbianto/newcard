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
import { topFilterList } from "src/data/quickAddFilterList";
import { variantFilters } from "src/data/variantFilters";
import { Stack } from "@mui/system";

export const ProductsSearch = (props) => {
  const { selectedFilter, setSelectedFilter, selectedVariantFilter, setSelectedVariantFilter, filterList } = props;
  const [filterOpt, setFilterOpt] = useState();
  const [isVariantFilters, setIsVariantFilters] = useState(false);
const orderFilterList = (type) => {
  const getProdType = filterList.find((item) => item.label === type)
  const orderedProdType = getProdType.values.map(
    (item) => item.label && item.label
  );
  return orderedProdType
}
  async function getGeneralFilter() {
    const newFilterOpt = {
      collection: [],
      productType: [],
      productVendor: [],
      tag: [],
    };
    const resCollection = await GetProductsMeta("collections");
    if (resCollection) {
    topFilterList.map((item) => {
      if(item.id === "collection") {
          const orderedCollection = resCollection.newData.data.collections.edges.map(
            (collection) => collection.node.handle
          );
          newFilterOpt.collection = orderedCollection;
      } else {
        if (filterList) {
          newFilterOpt.productType = orderFilterList("productType");
          newFilterOpt.productVendor = orderFilterList("productVendor");
          newFilterOpt.tag = orderFilterList("tag");
        }
      }
    })
  }
    setFilterOpt(newFilterOpt);
  }

  useEffect(() => {
    if(!filterOpt || filterOpt.tag.length === 0) {
      getGeneralFilter();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterList]);

  // PRODUCT SEARCH AND VARIANT FILTER
  const handleFilterChange = useCallback(
    (event) => {
      const newData = {
        [event.target.name] : event.target.value
      }
      const isHaveSameFilter = selectedVariantFilter.findIndex((n) => n.name === event.target.name)
      if(isHaveSameFilter < 0) {
        setSelectedVariantFilter([...selectedVariantFilter, newData])
      } else {
        selectedVariantFilter.splice(isHaveSameFilter, 1)
        setSelectedVariantFilter([...selectedVariantFilter, selectedVariantFilter[isHaveSameFilter] = newData])
      }

      let newSelectedFilter = selectedFilter;
      if (event) {
        newSelectedFilter = {
          ...selectedFilter,
          [event.target.name]: event.target.value,
        };
      }
      setSelectedFilter(newSelectedFilter);
    },
    [selectedFilter, selectedVariantFilter, setSelectedFilter, setSelectedVariantFilter]
  );

  const handleVariantFilterChange = useCallback((event) => {
    const splitVal = event.target.name.split("|-|");

    const newData = {
      variantOption: {
        name:splitVal[0],
        value:splitVal[1]
      }
    }
    const isHaveSameFilter = selectedVariantFilter.findIndex((n) => n.variantOption?.name === splitVal[0] && n.variantOption?.value === splitVal[1])
    if(isHaveSameFilter < 0) {
      setSelectedVariantFilter([...selectedVariantFilter, newData])
    } else {
      selectedVariantFilter.splice(isHaveSameFilter, 1)
      setSelectedVariantFilter([...selectedVariantFilter])
    }
  },[selectedVariantFilter, setSelectedVariantFilter]);
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
            disabled={selectedFilter.prodName ? true : false}
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
            disabled={selectedVariantFilter.length > 0 ? true : false}
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
          topFilterList.map((filter) => {
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
                      const isHaveSameFilter = selectedVariantFilter.findIndex((n) => n.variantOption?.name === variant.name && n.variantOption?.value === varVal)
                      return (
                        <FormControlLabel
                          key={i + 1}
                          control={
                            <Checkbox
                              checked={isHaveSameFilter < 0 ? false : true}
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
