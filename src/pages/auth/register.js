import { useState, useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useToast } from 'src/hooks/use-toast'

import Toast from 'src/components/toast'
import { Box, Link, Stack, Typography, Collapse } from '@mui/material';
import AddCompany from 'src/sections/companies/company-add'

const Page = () => {
  const [addNewCompany, setAddNewCompany] = useState(true);

  const router = useRouter();
  const { status } = useSession()
  const toastUp = useToast();

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/')
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    console.log("addNewCompany", addNewCompany)
    if (addNewCompany === undefined) {
      router.push('/auth/login')
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNewCompany]);

  return (
    <>
      <Head>
        <title>
          Register | Skratch
        </title>
      </Head>
      <Toast
        toastStatus={toastUp.toastStatus}
        handleStatus={toastUp.handleStatus}
        toastMessage={toastUp.toastMessage}
      />
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
            maxWidth: 700,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <Stack
            spacing={1}
            sx={{ mb: 3 }}
          >
            <Typography variant="h4">
              Register
            </Typography>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Already have an account?
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
          </Stack>
          <Collapse in={addNewCompany ? false : true}>
            <Typography variant="subtitle1" color="text.secondary">
              Thanks for registering, please check your contact email for set password!
            </Typography>
          </Collapse>
          <Collapse in={addNewCompany}>
            <AddCompany
              setAddNewCompany={setAddNewCompany}
              toastUp={toastUp}
              getSelectedVal={false}
              type="register"
            />
          </Collapse>
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
