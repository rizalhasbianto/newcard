import { useCallback, useEffect, useState } from "react";

import {
  Stack,
  Tab,
  Tabs,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { ImageComponent } from "src/components/image";

export const ProductImage = (props) => {
  const { imgGallery } = props;
  const [selectedImg, setSelectedImg] = useState();
  const [selectedTab, setSelectedTab] = useState(1);
  const handleTabChange = useCallback(
    (event, newValue) => {
      setSelectedTab(newValue);
      setSelectedImg(imgGallery[newValue - 1].node.bigUrl);
    },
    [selectedImg]
  );

  useEffect(() => {
    if (imgGallery) {
      setSelectedImg(imgGallery[0].node.bigUrl);
    }
  }, [imgGallery]);

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid md={3}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider", height: "500px" }}
          >
            {imgGallery &&
              imgGallery.map((item, i) => (
                <Tab
                  value={i + 1}
                  key={i + 1}
                  icon={<ImageComponent img={item.node.url} />}
                  sx={{
                    height: "100px",
                    position: "relative",
                    left: "-10px",
                    margin: "5px 0",
                  }}
                />
              ))}
          </Tabs>
        </Grid>
        <Grid
          md={9}
          sx={{ position: "relative" }}
          justifyContent={"center"}
          alignContent={"center"}
        >
          {selectedImg && <ImageComponent img={selectedImg} />}
        </Grid>
      </Grid>
    </Stack>
  );
};
