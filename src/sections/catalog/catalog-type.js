import { useState } from "react";
import { useRouter } from "next/router";
import { CreateCatalog } from "src/service/use-mongo"

import {
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  TextField
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";


const CatalogType = (props) => {
  const { toastUp, session } = props
  const [type, setType] = useState("all");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleCreateCatalog = async(props) => {
    if(!title) {
      setTitleError(true)
      return
    }
    setLoading(true)
    const resMongo = await CreateCatalog({
      title:title,
      type:type,
      status:"draft",
      createdBy:{
        name:session.user.detail.name,
        role:session.user.detail.role,
      }
    });
    if(!resMongo) {
      toastUp.handleStatus("error");
      toastUp.handleMessage("Failed create new catalog!!!");
      setLoading(false)
      return
    }
    router.push("/products/catalogs/" + resMongo.data.insertedId)
    setLoading(false)
  };
  return (
    <Card>
      <CardHeader subheader="Once selected can not be change!" title="Catalog Products Type" />
      <CardContent sx={{ pt: 0 }}>
      <TextField
            id="title"
            name="catalogTitle"
            label="Title"
            variant="outlined"
            value={title ?? ""}
            sx={{mb:1}}
            onChange={(e) => {setTitle(e.target.value); setTitleError(false)}}
            error={titleError}
          />
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={type}
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
