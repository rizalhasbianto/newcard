import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import ChevronUpDownIcon from "@heroicons/react/24/solid/ChevronUpDownIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Logo } from "src/components/logo";
import { ImageComponent } from "src/components/image";
import { Scrollbar } from "src/components/scrollbar";
import { items } from "../../data/nav-list";
import { SideNavItem } from "./side-nav-item";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    setLoading(true);
    signOut({ callbackUrl: "/auth/login" });
  };

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: "inline-flex",
              height: 50,
              width: 50,
              position: "relative",
            }}
          >
            <ImageComponent title="Certor" img="/certor1.png" />
          </Box>
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderRadius: 1,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              p: "12px",
            }}
          >
            <div>
              <Typography color="inherit" variant="subtitle1" sx={{ textTransform: "capitalize" }}>
                {session?.user?.detail.role === "customer"
                  ? session?.user?.detail?.company?.companyName
                  : session?.user?.detail?.role}
              </Typography>
              <Typography color="neutral.400" variant="body2">
                {session?.user?.detail.name}
              </Typography>
              <LoadingButton
                size="small"
                onClick={() => handleSignOut()}
                endIcon={<LogoutIcon />}
                loading={loading}
                loadingPosition="end"
                sx={{
                  border: "none",
                  paddingLeft: 0,
                  color: "#9DA4AE",
                }}
              >
                <span>Sign Out</span>
              </LoadingButton>
            </div>
            <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
              <ChevronUpDownIcon />
            </SvgIcon>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {items.map((item) => {
              let active;
              if (item.path === "/") {
                active = item.path ? pathname === item.path : false;
              } else {
                active = item.path ? pathname?.includes(item.path) : false;
              }
              if (item.role && !item.role.includes(session?.user?.detail.role)) {
                return;
              }
              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                  subMenu={item.subMenu}
                  role={session?.user?.detail.role}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "original.50",
            color: "common.white",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
