import { useSession } from "next-auth/react";
import { useCallback, useState, useEffect } from "react";
import { intervalToDuration } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
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
  const CountDownTime = useCallback((props) => {
    if (!props.time) return "";

    const now = utcToZonedTime(new Date(), "America/Los_Angeles");
    const time = intervalToDuration({
      start: new Date(props.time),
      end: now,
    });

    if (time.days !== 0) {
      return time.days + " days ago";
    }
    if (time.hours !== 0) {
      return time.hours + " hours ago";
    }
    if (time.minutes !== 0) {
      return time.minutes + " min ago";
    }
    if (time.seconds !== 0) {
      return time.seconds + " sec ago";
    }
    return "";
  }, []);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack sx={{ mb: 2 }} direction={"row"} justifyContent={"space-between"}>
          <Typography variant="subtitle1">{props?.dataTicket?.subject}</Typography>
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant="subtitle2" sx={{ mr: 2 }}>
              <Tags tag={props?.dataTicket.status} />
            </Typography>
            <Typography variant="subtitle2" sx={{ mr: 2 }}>
              <Tags tag={props?.dataTicket.category} />
            </Typography>
            <Typography variant="subtitle2" color={"neutral.500"}>
              <Tags tag={`#${props?.dataTicket._id.slice(-4)}`} />
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Box>
          {props?.dataTicket?.ticketMessages.map((item, i) => {
            return item.from === myName ? (
              <Grid container spacing={2} key={i + 1} sx={{mb:2, backgroundColor:"neutral.50"}}>
                <Grid item xl={2}>
                  <Typography variant="subtitle1">You</Typography>
                  <Typography variant="subtitle2">{item.role}</Typography>
                  <Typography variant="body3">
                    <CountDownTime time={item.time} />
                  </Typography>
                </Grid>
                <Grid item xl={10} sx={{borderLeft:"1px solid #e0e0e0"}}>
                  <Typography variant="body1" >{item.message}</Typography>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2} key={i + 1} sx={{mb:2, backgroundColor:"neutral.100"}}>
                <Grid item xl={10} sx={{textAlign:"right", borderRight:"1px solid #e0e0e0"}}>
                  <Typography variant="body1">{item.message}</Typography>
                </Grid>
                <Grid item xl={2} sx={{textAlign:"right"}}>
                  <Typography variant="subtitle1">{item.from}</Typography>
                  <Typography variant="subtitle2">{item.role}</Typography>
                  <Typography variant="body3">
                    <CountDownTime time={item.time} />
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};
