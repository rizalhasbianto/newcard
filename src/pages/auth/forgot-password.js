import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from '@mui/icons-material/Send';
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { CheckUserEmail, ResetPassword, UpdatePassword } from "src/service/use-mongo";

const Page = () => {
  const { status } = useSession();
  const [errorUser, setErrorUser] = useState();
  const [successUpdate, setSuccessUpdate] = useState();
  const [loadingLogin, setLoadingLogin] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setErrorUser("You are loged in!");
      return;
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      contactEmail: "",
      submit: null,
    },
    validationSchema: Yup.object({
      contactEmail: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoadingLogin(true)
      const checkUser = await CheckUserEmail(values.contactEmail);
      if(!checkUser || checkUser.data.length <= 0) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "user not found!!" });
        helpers.setSubmitting(false);
        return
      }

      //const resUpdatePassword = await UpdatePassword("", checkUser.data[0]._id);

      //if(!resUpdatePassword) {
      //  helpers.setStatus({ success: false });
      //  helpers.setErrors({ submit: "Reset pasword failed!!" });
      //  helpers.setSubmitting(false);
      //  return
      //}

      const resInvite = await ResetPassword(checkUser.data[0]);
      if (!resInvite) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Error when send email, please try again later!!" });
        helpers.setSubmitting(false);
        return
      }
      setLoadingLogin(false)
      setSuccessUpdate("done");
    },
  });

  return (
    <>
      <Head>
        <title>Forgot Password | Skratch</title>
      </Head>
      <Box
        sx={{
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
              <Typography variant="h4">Reset Password</Typography>
              {(successUpdate || errorUser) && (
                <Typography color="text.secondary" variant="body2">
                  Back to &nbsp;
                  <Link
                    component={NextLink}
                    href="/auth/login"
                    underline="hover"
                    variant="subtitle2"
                  >
                    Log in
                  </Link>
                </Typography>
              )}
            </Stack>
            {errorUser && (
              <Typography variant="body2" color="error.main">
                {errorUser}
              </Typography>
            )}
            {successUpdate && (
              <Typography variant="body2" color="success.main">
                Please check your email inbox!
              </Typography>
            )}
            {!errorUser && !successUpdate && (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.contactEmail && formik.errors.contactEmail)}
                    fullWidth
                    helperText={formik.touched.contactEmail && formik.errors.contactEmail}
                    label="Email"
                    name="contactEmail"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.contactEmail}
                  />
                </Stack>
                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <LoadingButton
                    fullWidth
                    color="primary"
                    sx={{ mt: 3 }}
                    loading={loadingLogin}
                    loadingPosition="start"
                    startIcon={<SendIcon />}
                    variant="contained"
                    type="submit"
                  >
                    Send link to my email
                  </LoadingButton>
              </form>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
