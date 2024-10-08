import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { CircularProgress, Stack } from "@mui/material";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
  background: "#f2f2f3",
});

export const Layout = (props) => {
  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);
  const [sessionStatus, setSessionStatus] = useState();
  const { data: session, status } = useSession();

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );
  useEffect(
    () => {
      if(session === null || session === undefined) {
        console.log("session empty")
      } else {
        setSessionStatus(session)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, status]
  );

  return (
    <>
      {
        //<TopNav onNavOpen={() => setOpenNav(true)} />
      }
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>
          {sessionStatus ? (
            children
          ) : (
            <Stack
              sx={{
                height: "100vh",
                width: "100%",
              }}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <CircularProgress />
            </Stack>
          )}
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
};
