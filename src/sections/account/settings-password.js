import { useState } from "react";
import { UpdatePassword } from "src/service/use-mongo";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Typography
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useFormik } from "formik";
import * as Yup from "yup";

export const SettingsPassword = (props) => {
  const { userData } = props;
  console.log("userData", userData);
  const [openPass, setOpenPass] = useState(false);
  const [successUpdate, setSuccessUpdate] = useState();

  const formik = useFormik({
    initialValues: {
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .max(255)
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
      confirm: Yup.string()
        .max(255)
        .required("Password is required")
        .oneOf([Yup.ref("password"), null], "Password must match"),
    }),
    onSubmit: async (values, helpers) => {
      const resUpdatePassword = await UpdatePassword(values.password, userData.detail.id, "reset");
      if (resUpdatePassword) {
        setSuccessUpdate("done");
      }
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <TextField
              error={!!(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type={openPass ? "text" : "password"}
              value={formik.values.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setOpenPass(!openPass)}
                      onMouseDown={() => setOpenPass(!openPass)}
                      edge="end"
                    >
                      {openPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              error={!!(formik.touched.confirm && formik.errors.confirm)}
              fullWidth
              helperText={formik.touched.confirm && formik.errors.confirm}
              label="Password"
              name="confirm"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type={openPass ? "text" : "password"}
              value={formik.values.confirm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setOpenPass(!openPass)}
                      onMouseDown={() => setOpenPass(!openPass)}
                      edge="end"
                    >
                      {openPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
        {successUpdate && (
            <Typography variant="body2" color="success.main" sx={{mr:2}}>
              Your new password has been set!
            </Typography>
          )}
          <Button variant="contained" type="submit">Update</Button>
        </CardActions>
      </Card>
    </form>
  );
};
