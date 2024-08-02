import { Alert, Stack, Slide } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function Toast(props) {
  const { toastStatus, handleStatus, toastMessage } = props;
  return (
    <Stack variant={"alert"} spacing={2} onClick={() => handleStatus("")}>
      <Slide direction="up" in={toastStatus ? true : false} mountOnEnter unmountOnExit>
        {toastStatus === "loading" ? (
          <Alert
            severity={"info"}
            color={"info"}
            icon={<CircularProgress size={17} sx={{position:"relative",top:"3px"}}/>}
          >
            {toastMessage}
          </Alert>
        ) : (
          <Alert
            severity={toastStatus ? toastStatus : "success"}
            color={toastStatus ? toastStatus : "success"}
          >
            {toastMessage}
          </Alert>
        )}
      </Slide>
    </Stack>
  );
}
