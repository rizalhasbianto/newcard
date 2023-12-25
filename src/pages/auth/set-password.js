import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { FindUserById, UpdatePassword } from 'src/service/use-mongo'

const Page = () => {
  const router = useRouter();
  const { id, type } = router.query;
  const { status } = useSession()
  const [errorUser, setErrorUser] = useState()
  const [successUpdate, setSuccessUpdate] = useState()
  const [openPass, setOpenPass] = useState(false);
  const getUser = useCallback(
    async (id, type) => {
      if (id) {
        const resUser = await FindUserById(id)
        if (!resUser) {
          setErrorUser("Error get user!")
          return
        }
        if (resUser.data.length === 0) {
          setErrorUser("User not found!")
          return
        }
      }
    }, []
  )

  useEffect(() => {
    if (status === "authenticated") {
      setErrorUser("You are loged in!")
      return
    }
    getUser(id, type)
  }, [getUser, id, status]);

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
      const resUpdatePassword = await UpdatePassword(values.password, id, type)
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
            {successUpdate &&

              <Typography
                variant="body2"
                color="success.main"
              >
                Your new password has been set!
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
