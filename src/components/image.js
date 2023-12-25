import Image from "next/image";
import { CircularProgress, Stack } from "@mui/material";
import { useEffect, useState, useRef } from "react";

export const ImageComponent = (props) => {
  const { img, title } = props;
  const [loading, setLoading] = useState(true);
  const image = img ? img : "/assets/default.png";
  const alt = title ? title : "skratch b2b";
  const imageLoad = useRef()

  useEffect(() => {
    setLoading(true);
  }, [img]);

  useEffect(() => {
    if (imageLoad.current.complete) setLoading(false)
}, [])

  return (
    <>
      <Image
        ref={imageLoad}
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
            left: 0,
            top: 0,
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
