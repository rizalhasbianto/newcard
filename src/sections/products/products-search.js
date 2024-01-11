import { useCallback, useEffect, useState } from "react";
import { GetProductsMeta } from "src/service/use-shopify";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Card,
  Box,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  TextField,
  MenuItem,
  SvgIcon,
  Skeleton,
  Button,
  Collapse,
  Checkbox,
  Unstable_Grid2 as Grid,
  Typography,
} from "@mui/material";
import { topFilterList } from "src/data/quickAddFilterList";

const ProductsSearch = (props) => {
  const {
    selectedFilter,
    setSelectedFilter,
    selectedVariantFilter,
    setSelectedVariantFilter,
    filterList,
    smartSearch,
    setSmartSearch,
    predictiveSearch
  } = props;
 
  const [filterOpt, setFilterOpt] = useState();
  const [variantFilterOpt, setVariantFilterOpt] = useState();
  const [isVariantFilters, setIsVariantFilters] = useState(false);
  const orderFilterList = (type) => {
    const getProdType = filterList.find((item) => item.label === type);
    if(!getProdType) return

    const orderedProdType = getProdType.values.map((item) => ({
      label: item.label,
      count: item.count,
    }));
    return orderedProdType;
  };
  async function getGeneralFilter() {
    const newFilterOpt = {
      collection: [],
      productType: [],
      productVendor: [],
      tag: [],
    };

    let resCollection = false;
    if (!filterOpt) {
      resCollection = await GetProductsMeta("collections");
    } else {
      resCollection = true;
    }

    if (resCollection) {
      topFilterList.map((item) => {
        if (item.id === "collection") {
          if (!filterOpt) {
            const orderedCollection = resCollection.newData.data.collections.edges.map(
              (collection) => ({ label: collection.node.handle, count: 10 })
            );
            newFilterOpt.collection = orderedCollection;
          } else {
            newFilterOpt.collection = filterOpt.collection;
          }
        } else {
          if (filterList) {
            newFilterOpt.productType = orderFilterList("productType");
            newFilterOpt.productVendor = orderFilterList("productVendor");
            newFilterOpt.tag = orderFilterList("tag");
          }
        }
      });
    }
    setFilterOpt(newFilterOpt);
  }

  useEffect(() => {
    if (filterList) {
      getGeneralFilter();
      setVariantFilterOpt(filterList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterList]);

  // PRODUCT SEARCH AND VARIANT FILTER
  const handleFilterChange = useCallback(
    (event) => {
      if(event.target.name !== "collection") {
        const newData = {
          [event.target.name]: event.target.value,
        };
        const isHaveSameFilter = selectedVariantFilter.findIndex((n) => n[event.target.name]);
        if (isHaveSameFilter < 0) {
          setSelectedVariantFilter([...selectedVariantFilter, newData]);
        } else {
          if(event.target.value) {
            selectedVariantFilter[isHaveSameFilter] = newData
            setSelectedVariantFilter([
              ...selectedVariantFilter
            ]);
          } else {
            selectedVariantFilter.splice(isHaveSameFilter, 1);
          }
        }
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

  const handleVariantFilterChange = useCallback(
    (event) => {
      const splitVal = event.target.name.split("|-|");

      const newData = {
        variantOption: {
          name: splitVal[0],
          value: splitVal[1],
        },
      };
      const isHaveSameFilter = selectedVariantFilter.findIndex(
        (n) => n.variantOption?.name === splitVal[0] && n.variantOption?.value === splitVal[1]
      );
      if (isHaveSameFilter < 0) {
        setSelectedVariantFilter([...selectedVariantFilter, newData]);
      } else {
        selectedVariantFilter.splice(isHaveSameFilter, 1);
        setSelectedVariantFilter([...selectedVariantFilter]);
      }
    },
    [selectedVariantFilter, setSelectedVariantFilter]
  );

  return (
    <>
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
              disabled={selectedFilter.collection ? true : false}
            >
              Variant
            </Button>
          </Grid>
          <Grid lg={3}>
            <TextField
              id="productName"
              name="productName"
              label="Product Name"
              value={selectedFilter.selectedProdName}
              fullWidth
              onChange={handleFilterChange}
              disabled={selectedVariantFilter.filter(e => e["variantOption"]).length > 0 ? true : false}
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
                      disabled={filter.id === "collection" && selectedVariantFilter.filter(e => e["variantOption"]).length > 0 ? true : false}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {filterOpt[filter.id]?.map((option) => (
                        <MenuItem
                          key={option.label}
                          value={option.label}
                          disabled={!smartSearch && option.count ? false : true}
                        >
                          {option.label}
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
              <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Smart Search</FormLabel>
                <FormGroup
                  sx={{
                    display: "block",
                    maxHeight: "300px",
                    maxWidth: "200px",
                    overflow: "auto",
                  }}
                >
                  <TextField
                      id="smartSearch"
                      name="smartSearch"
                      label="Smart Search"
                      value={smartSearch}
                      fullWidth
                      onChange={(e)=> setSmartSearch(e.target.value)}
                      sx={{ maxHeight: 250, marginTop: "10px" }}
                      disabled={selectedVariantFilter.filter(e => e["variantOption"]).length > 0 ? true : false}
                    ></TextField>
                    {
                      predictiveSearch 
                      ? predictiveSearch.map((item, i) => (
                        <Button 
                        variant="outlined" 
                        key={i+1}
                        sx={{margin: "5px"}}
                        onClick={()=> setSmartSearch(item.text)}
                        >
                          <span dangerouslySetInnerHTML={{ __html: item.styledText }} />
                        </Button>
                      ))
                      : ""
                    }
                    
                </FormGroup>
              </FormControl>
              {variantFilterOpt &&
                variantFilterOpt.map((variant, idx) => {
                  if (
                    variant.label !== "Price" &&
                    variant.label !== "productType" &&
                    variant.label !== "tag" &&
                    variant.label !== "productVendor"
                  ) {
                    return (
                      <FormControl
                        sx={{ m: 3 }}
                        component="fieldset"
                        variant="standard"
                        key={idx + 1}
                      >
                        <FormLabel component="legend">{variant.label}</FormLabel>
                        <FormGroup
                          sx={{
                            display: "block",
                            maxHeight: "300px",
                            overflow: "auto",
                          }}
                        >
                          {variant.values.map((varVal, i) => {
                            const isHaveSameFilter = selectedVariantFilter.findIndex(
                              (n) =>
                                n.variantOption?.name === variant.label &&
                                n.variantOption?.value === varVal.label
                            );
                            return (
                              <FormControlLabel
                                key={i + 1}
                                control={
                                  <Checkbox
                                    checked={isHaveSameFilter < 0 ? false : true}
                                    onChange={handleVariantFilterChange}
                                    name={`${variant.label}|-|${varVal.label}`}
                                    disabled={ !smartSearch && varVal.count > 0 ? false : true }
                                  />
                                }
                                label={`${varVal.label} (${varVal.count})`}
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
                  }
                })}
            </Box>
          </Box>
        </Collapse>
      </Card>
      <Collapse in={!isVariantFilters}>
        <Box sx={{ padding: "0 20px" }}>
          {selectedVariantFilter.length > 0 ? (
            <Typography variant="caption" sx={{ display: "inline-block", marginRight: "10px" }}>
              Selected Variant Filter:
            </Typography>
          ) : (
            ""
          )}
          {selectedVariantFilter?.map((item, i) => {
            return item.variantOption ? (
              <Typography key={i + 1} variant="caption" sx={{ display: "inline-block", marginRight: "5px" }}>
                {item.variantOption.name}: {item.variantOption.value}
              </Typography>
            ) : (
              ""
            );
          })}
        </Box>
      </Collapse>
    </>
  );
};

export default ProductsSearch 