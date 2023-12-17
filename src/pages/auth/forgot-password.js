import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { CheckUserEmail, ResetPassword } from "src/service/use-mongo";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();
  const [errorUser, setErrorUser] = useState();
  const [successUpdate, setSuccessUpdate] = useState();

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
      const checkUser = await CheckUserEmail(values.contactEmail);
      if (checkUser?.data.length > 0) {
        const resInvite = await ResetPassword(checkUser.data[0]);
        if (resInvite) {
          setSuccessUpdate("done");
        } else {
          setErrorUser("Error when send email, please try again later!!");
        }
      } else {
        formik.setErrors({ contactEmail: "user not found!!" });
      }
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
              <Typography variant="h4">Set Password</Typography>
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
                <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                  Send link to my email
                </Button>
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
