import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { stringAvatar } from "src/helper/handelCompanyAvatar";

export const AccountProfile = (props) => {
  const { userData } = props;
console.log("userData profile", userData)
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar {...stringAvatar(userData.name, "large")}/>
          <Typography gutterBottom variant="h5" sx={{ textTransform: "capitalize", mt:2 }}>
            {userData.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {userData.email} | {userData?.detail.company?.companyName}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          <Link href={`/dashboard/account/company/${userData?.detail.company?.companyId}`} passHref>
            Edit company
          </Link>
        </Button>
      </CardActions>
    </Card>
  );
};
