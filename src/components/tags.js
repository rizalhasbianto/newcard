import {
  Chip,
} from "@mui/material";

export const Tags = ({ tag }) => {
  const colorTag = () => {
    switch (tag) {
      case "New":
        return "success";
      case "Open":
        return "primary";
      default:
        return "primary";
    }
  };
  
  return (<Chip label={tag} color={colorTag()} variant="outlined"/>);
};
