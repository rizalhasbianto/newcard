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

import { useState, useCallback, useEffect } from "react";

export default function QuotesCollection(props) {
  const { collections, DeleteQuoteCollections, isValidating, mutate } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [quotesList, setQuotesList] = useState(collections[0].quotesList);
  const handleChange = useCallback(
    (event, newValue) => {
      setTabIndex(newValue);
      setQuotesList(collections[newValue].quotesList);
    },
    [collections]
  );

  const handleDeleteQuote = async (id) => {
    const resDeleteCollection = await DeleteQuoteCollections(id);
    if (resDeleteCollection) {
      mutate();
      setTabIndex(0);
      setQuotesList(collections[0].quotesList);
    }
  };

  useEffect(() => {
    if (!collections) return;
    setQuotesList(collections[tabIndex].quotesList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections]);

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
          loading={isValidating}
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
                  <Stack container alignItems="center" direction="row" spacing={2}>
                    {tabIndex === i ? (
                      <DeleteIcon onClick={() => handleDeleteQuote(collection._id)} />
                    ) : (
                      <DeleteIcon sx={{ opacity: 0.3 }} />
                    )}
                    <Typography variant="subtitle1">
                      {collection.collectionName || "New Collection"}
                    </Typography>
                  </Stack>
                }
                iconPosition="start"
                key={i + 1}
                sx={{ mr: 2 }}
              />
            );
          })}
        </Tabs>
      </Stack>
      {quotesList && (
        <LineItemQuotes
          quotesList={quotesList}
          setQuotesList={setQuotesList}
          layout="collection"
          total={total}
          setTotal={setTotal}
        />
      )}
    </Stack>
  );
}
