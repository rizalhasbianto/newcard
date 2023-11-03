import Image from "next/image";
import { CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export const ImageComponent = (props) => {
  const [loading, setLoading] = useState(true);
  const { img, title } = props;
  const image = img ? img : "/assets/default.png";
  const alt = title ? title : "skratch b2b";

  useEffect(() => {
    setLoading(true);
  }, [img]);

  return (
    <>
      <Image
        src={image}
        fill={true}
        alt={alt}
        className="shopify-fill"
        sizes="270 640 750"
        onLoad={(e) => setLoading(false)}
      />
      {loading && (
        <Stack
          sx={{
            position: "absolute",
            zIndex: 2,
            width: "100%",
            height: "100%",
            background: "rgba(241, 241, 241, 0.47)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Stack>
      )}
    </>
  );
};
