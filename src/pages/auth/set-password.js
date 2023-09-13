import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useCallback, useEffect, useState } from 'react';
import { findUserById, updatePassword } from 'src/service/use-mongo'

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const [errorUser, setErrorUser] = useState()
  const [successUpdate, setSuccessUpdate] = useState()

  const getUser = useCallback(
    async (id) => {
      if (id) {
        const resUser = await findUserById(id)
        if (!resUser) {
          setErrorUser("Error get user")
          return
        }
        if (resUser.data.length === 0) {
          setErrorUser("User not found")
          return
        }
        if (resUser.data[0].password !== "") {
          setErrorUser("User already have password")
          return
        }
      }
    }, []
  )

  useEffect(() => {
    getUser(id)
  }, [getUser, id]);

  const formik = useFormik({
    initialValues: {
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        )
    }),
    onSubmit: async (values, helpers) => {
      const resUpdatePassword = await updatePassword(values.password, id)
      if (resUpdatePassword) {
        setSuccessUpdate("done")
      }
    }
  });

  return (
    <>
      <Head>
        <title>
          Set Password | Skratch
        </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Set Password
              </Typography>
              {
                (successUpdate || errorUser) &&
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Back to
                  &nbsp;
                  <Link
                    component={NextLink}
                    href="/auth/login"
                    underline="hover"
                    variant="subtitle2"
                  >
                    Log in
                  </Link>
                </Typography>
              }
            </Stack>
            {errorUser &&

              <Typography
                variant="body2"
                color="error.main"
              >
                {errorUser}
              </Typography>
            }
            {!errorUser && !successUpdate &&
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />
                </Stack>
                {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Continue
                </Button>
              </form>
            }
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;