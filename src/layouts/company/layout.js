import PropTypes from "prop-types";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Logo } from "src/components/logo";
import { ImageComponent } from "src/components/image";
import { TopNav } from "./top-nav";

// TODO: Change subtitle text

export const Layout = (props) => {
  const { children } = props;
  const { store } = useRouter().query;
  const LayoutContainer = styled("div")({
    display: "block",
    width: "100%",
    background: "#f2f2f3",
  });

  const logo = store ? `/${store}.png` : `/certor.png`;

  return (
    <LayoutContainer>
      <Box
        sx={{
          display: "flex",
          height: 60,
          width: "100%",
          position: "relative",
          background: "#fff",
        }}
      >
        <Box
          component={NextLink}
          href="/"
          sx={{
            display: "inline-flex",
            height: 40,
            width: 150,
            position: "relative",
            top: 10,
            left: 20,
          }}
        >
          <ImageComponent title="Certor" img={logo} />
        </Box>
        <TopNav onNavOpen={() => setOpenNav(true)} />
      </Box>
      <Box component="main">{children}</Box>
    </LayoutContainer>
  );
};

Layout.prototypes = {
  children: PropTypes.node,
};
