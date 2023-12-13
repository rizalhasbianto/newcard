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
  Divider,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Tags } from "src/components/tags";

export const MessageList = (props) => {
  const { data } = useSession();
  const myName = data.user.name;
  console.log("props", props);
  console.log("data", data);
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack sx={{ mb: 2 }} direction={"row"} justifyContent={"space-between"}>
          <Typography variant="subtitle1">{props.dataTicket.subject}</Typography>
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant="subtitle2" sx={{ mr: 2 }}>
              <Tags tag={props.dataTicket.status} />
            </Typography>
            <Typography variant="subtitle2" sx={{ mr: 2 }}>
              <Tags tag={props.dataTicket.category} />
            </Typography>
            <Typography variant="subtitle2" color={"neutral.500"}>
              <Tags tag={`#${props.dataTicket._id.slice(-4)}`} />
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Box>
          {props.dataTicket.ticketMessages.map((item, i) => {
            return item.from === myName ? (
              <Grid container spacing={2} key={i + 1}>
                <Grid xl={2}>test</Grid>
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
