import { useState } from "react";
import { CreateCatalog } from "src/service/use-mongo"

import {
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";

const CatalogType = () => {
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(false);
  const handleCreateCatalog = async(props) => {
    setLoading(true)
    const resMongo = await CreateCatalog(type);
    if(!resMongo) {

    }

    setLoading(false)
  };
  return (
    <Card>
      <CardHeader subheader="Once selected can not be change!" title="Catalog Products Type" />
      <CardContent sx={{ pt: 0 }}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue={type}
          name="radio-buttons-group"
          onChange={(e) => setType(e.target.value)}
        >
          <FormControlLabel value="all" control={<Radio />} label="All Products" />
          <FormLabel sx={{ pl: 4 }}>All of your products will be included.</FormLabel>
          <FormControlLabel value="source" control={<Radio />} label="Specific Source" />
          <FormLabel sx={{ pl: 4 }}>
            Choose from specific source like vendor, type and tag.
          </FormLabel>
          <FormControlLabel value="specific" control={<Radio />} label="Specific Products" />
          <FormLabel sx={{ pl: 4 }}>Choose which products to include.</FormLabel>
        </RadioGroup>
        <LoadingButton
          color="primary"
          loading={loading}
          loadingPosition="start"
          startIcon={<AddToHomeScreenIcon />}
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => handleCreateCatalog()}
        >
          Continue
        </LoadingButton>
      </CardContent>
    </Card>
  );
};

export default CatalogType;
