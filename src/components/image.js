import Image from "next/image";

export const ImageComponent = (props) => {
    const {img, title} = props
    console.log("title", title)
    console.log("img", img)
    const image = img ? img : "/assets/default.png";
    const alt = title ? title : "skratch b2b"
    
    return (
        <Image
            src={image}
            fill={true}
            alt={alt}
            className="shopify-fill"
            sizes="270 640 750"
      />
    );
  };