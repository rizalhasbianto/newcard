import { Box, Button, Divider, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Stack } from "@mui/system";

export const CompanyUsers = (props) => {
  const { data, toastUp, setSwitchEditDetails } = props;

  return (
    <Box sx={{ m: -1.5 }}>
      <Grid container spacing={1} alignItems={"flex-start"} justifyItems={"flex-start"}>
        <Grid item xs={4} md={3}>
          <Typography variant="subtitle2" color="neutral.500">
            Default Contact
          </Typography>
        </Grid>
        <Grid itemxs={8} md={9}>
          <Typography variant="subtitle2">: {data.name}</Typography>
        </Grid>
        <Grid item xs={12} md={12}>
    <Divider />
        </Grid>
      </Grid>
    </Box>
  );
};
