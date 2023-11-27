import {
  Box,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  Slide,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LineItemQuotes from "../quotes-line-item";

import { useState, useCallback } from "react";

export default function QuotesCollection(props) {
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [quotesList, setQuotesList] = useState();
  const { collections } = props;
  console.log("collections", collections);
  const handleChange = useCallback(
    (event, newValue) => {
      setLoading(true);
      setTimeout(() => {
        setTabIndex(newValue);
        setQuotesList(collections[newValue].quotesList)
        //setTabContent(collections[newValue]);
        setLoading(false);
      }, 500);
    },
    [collections]
  );

  const handleDeleteQuote = () => {
    console.log("delete");
  };

  return (
    <Stack spacing={3}>
      <Stack
        spacing={1}
        direction={"row"}
        sx={{
          position: "sticky",
          top: "0px",
          zIndex: "3",
        }}
      >
        <LoadingButton
          color="primary"
          //onClick={handleAddQuote}
          loading={loading}
          loadingPosition="start"
          startIcon={<AddIcon />}
          variant="outlined"
        >
          Add
        </LoadingButton>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
          direction="left"
        >
          {collections.map((collection, i) => {
            return (
              <Tab
                label={
                  <Grid container alignItems="center" spacing={2}>
                    <Grid md={3}>
                      {tabIndex === i ? (
                        <DeleteIcon onClick={() => handleDeleteQuote(quote._id)} />
                      ) : (
                        <DeleteIcon sx={{ opacity: 0.3 }} />
                      )}
                    </Grid>
                    <Grid md={9}>
                      <Typography variant="subtitle1">
                        {collection.collectionName || "New Collection"}
                      </Typography>
                    </Grid>
                  </Grid>
                }
                iconPosition="start"
                key={i + 1}
                sx={{ mr: 2 }}
              />
            );
          })}
        </Tabs>
      </Stack>
      {
        quotesList && 
<LineItemQuotes
        quotesList={quotesList}
        setQuotesList={setQuotesList}
        layout="collection"
      />
      }
      
    </Stack>
  );
}
