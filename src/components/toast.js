import {
    Alert,
    Stack,
    Slide,
  } from '@mui/material';

export default function Toast(props) {
    const { toastStatus, handleStatus, toastMessage} = props
    return (
        <Stack
        variant={"alert"}
        spacing={2}
        onClick={() => handleStatus("")}
      >
        <Slide
          direction="left"
          in={toastStatus ? true : false}
          mountOnEnter
          unmountOnExit
        >
          <Alert
            severity={toastStatus&& toastStatus}
            color={toastStatus&& toastStatus}
          >
            {toastMessage}
          </Alert>
        </Slide>
      </Stack>
    )
}