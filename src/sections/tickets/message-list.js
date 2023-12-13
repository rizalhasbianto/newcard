import { useSession } from "next-auth/react";

import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";

export const MessageList = (props) => {
  const { data } = useSession();
  const myName = data.user.name;
  console.log("item", props);
  console.log("data", data);
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box>
          
            {props.messages.map((item, i) => {
              return item.from === myName ? (
                    <Grid container spacing={2} key={i + 1}>
                  <Grid xl={2}>ID:</Grid>
                  <Grid xl={10}>Status:</Grid>
                  </Grid>
              ) : (
                <Grid container spacing={2} key={i + 1}>
                  <Grid xl={10}>ID:</Grid>
                  <Grid xl={2}>Status:</Grid>
                  </Grid>
              );
            })}
        </Box>
      </CardContent>
    </Card>
  );
};
