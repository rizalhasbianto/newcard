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
    catalogID,
    setSelectedVariantFilter,
    filterList,
    smartSearch,
    setCatalogID,
    setSmartSearch,
    predictiveSearch,
    session,
  } = props;

  const [filterOpt, setFilterOpt] = useState();
  const [catalogData, setCatalogData] = useState();
  const [variantFilterOpt, setVariantFilterOpt] = useState();
  const [isVariantFilters, setIsVariantFilters] = useState(false);

  useEffect(() => {
    if (filterList) {
      getFilterOpt(); // restructure filter data for catalog, collection, productType, productVendor, tag
      setVariantFilterOpt(filterList); // pass filterdata into list for variant
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterList]);

  async function getFilterOpt() {
    const newFilterOpt = {
      collection: [],
      productType: [],
      productVendor: [],
      tag: [],
      Catalog: [],
    };

    let resCollection = false;
    let resCatalog = false;
    if (!filterOpt) {
      // run get collection once, no need update
      resCollection = await GetProductsMeta("collections");
    } else {
      resCollection = true;
    }

    if (!catalogData) {
      // run get catalog data once no need update
      resCatalog = await GetProductsMeta("Catalog");
      setCatalogData(resCatalog);
    } else {
      resCatalog = catalogData;
    }

    if (resCollection && resCatalog) {
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
        } else if (item.id === "Catalog") {
          const catalogRawList = orderFilterList(item.id);
          if (filterList && catalogRawList) {
            let catalogList = [];
            catalogRawList.forEach((itm) => {
              const findCatalog = resCatalog.newData?.find((ctl) =>
                ctl.node.id.includes(itm.label)
              );
              if (findCatalog) {
                catalogList.push({
                  label: findCatalog.node.title,
                  id: findCatalog.node.id.replace("gid://shopify/CompanyLocationCatalog/", ""),
                  count: itm.count,
                });
              }
            });
            newFilterOpt[item.id] = catalogList;
          }
        } else {
          if (filterList) {
            newFilterOpt[item.id] = orderFilterList(item.id);
          }
        }
      });
    }
    setFilterOpt(newFilterOpt);
  }

  const orderFilterList = (type) => {
    // restructure filter data
    const getProdType = filterList.find((item) => item.label === type);
    if (!getProdType) return;
    const orderedProdType = getProdType.values.map((item) => ({
      label: item.label,
      count: item.count,
    }));
    return orderedProdType;
  };

  // PRODUCT SEARCH AND VARIANT FILTER
  const handleFilterChange = useCallback(
    (event) => {
      if (event.target.name !== "collection") {
        const newData = {
          [event.target.name]: event.target.value,
        };
        const isHaveSameFilter = selectedVariantFilter.findIndex((n) => n[event.target.name]);
        if (isHaveSameFilter < 0) {
          setSelectedVariantFilter([...selectedVariantFilter, newData]);
        } else {
          if (event.target.value) {
            selectedVariantFilter[isHaveSameFilter] = newData;
            setSelectedVariantFilter([...selectedVariantFilter]);
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

  const handleCatalogFilterChange = useCallback(
    (event) => {
      if (event.target.checked) {
        setCatalogID([...catalogID, event.target.name]);
      } else {
        const catalogIndex = catalogID.findIndex((n) => n === event.target.name);
        catalogID.splice(catalogIndex, 1);
        setCatalogID([...catalogID]);
      }
    },
    [catalogID, setCatalogID]
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
              disabled={
                selectedVariantFilter.filter((e) => e["variantOption"]).length > 0 ? true : false
              }
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
                filterOpt &&
                filter.id !== "Catalog" && (
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
                      disabled={
                        filter.id === "collection" &&
                        selectedVariantFilter.filter((e) => e["variantOption"]).length > 0
                          ? true
                          : false
                      }
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
              {session?.user.detail.role !== "customer" && filterOpt?.Catalog?.length > 0 && (
                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                  <FormLabel component="legend">Catalog</FormLabel>
                  <FormGroup
                    sx={{
                      display: "block",
                      maxHeight: "300px",
                      maxWidth: "200px",
                      overflow: "auto",
                    }}
                  >
                    {filterOpt?.Catalog?.map((itm, idx) => {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={handleCatalogFilterChange}
                              name={itm.id}
                              disabled={itm.count > 0 ? false : true}
                            />
                          }
                          label={`${itm.label} (${itm.count})`}
                          sx={{
                            display: "block",
                            width: "max-content",
                          }}
                          key={idx + 1}
                        />
                      );
                    })}
                  </FormGroup>
                </FormControl>
              )}
              {variantFilterOpt &&
                variantFilterOpt.map((variant, idx) => {
                  if (
                    variant.label !== "Price" &&
                    variant.label !== "productType" &&
                    variant.label !== "tag" &&
                    variant.label !== "productVendor" &&
                    variant.label !== "Catalog"
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
                                    disabled={!smartSearch && varVal.count > 0 ? false : true}
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
              <Typography
                key={i + 1}
                variant="caption"
                sx={{ display: "inline-block", marginRight: "5px" }}
              >
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

export default ProductsSearch;
