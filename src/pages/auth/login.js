import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { signIn } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const { status } = useSession();
  const [openPass, setOpenPass] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoadingLogin(true);
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (res.error) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: res.error });
        helpers.setSubmitting(false);
      } else {
        window.location.replace("/");
      }
      setLoadingLogin(false);
    },
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/')
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      <Head>
        <title>Login | Skratch</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </Stack>
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <Grid container spacing={2} alignItems={"center"}>
                    <Grid lg={11}>
                      <TextField
                        error={!!(formik.touched.email && formik.errors.email)}
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        label="Email Address"
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="email"
                        value={formik.values.email}
                      />
                    </Grid>
                    <Grid lg={11}>
                      <TextField
                        error={!!(formik.touched.password && formik.errors.password)}
                        fullWidth
                        helperText={formik.touched.password && formik.errors.password}
                        label="Password"
                        name="password"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type={openPass ? "text" : "password"}
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
                        value={formik.values.password}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <Grid lg={11}>
                  <LoadingButton
                    fullWidth
                    color="primary"
                    sx={{ mt: 3 }}
                    loading={loadingLogin}
                    loadingPosition="start"
                    startIcon={<LoginIcon />}
                    variant="contained"
                    type="submit"
                  >
                    Continue
                  </LoadingButton>
                </Grid>
                <Alert color="primary" severity="info" sx={{ mt: 3 }}>
                  <div>
                    <Typography color="text.secondary" variant="body2">
                      Forgot password? &nbsp;
                      <Link
                        component={NextLink}
                        href="/auth/forgot-password"
                        underline="hover"
                        variant="subtitle2"
                      >
                        click here!
                      </Link>
                    </Typography>
                  </div>
                </Alert>
              </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
