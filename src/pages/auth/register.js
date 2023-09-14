import { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useToast } from 'src/hooks/use-toast'

import Toast from 'src/components/toast'
import { Box, Link, Stack, TextField, Typography, Collapse } from '@mui/material';
import AddCompany from 'src/sections/companies/company-add'
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

import {
  checkUserEmail,
  registerUser,
} from 'src/service/use-mongo'

const Page = () => {
  const [companyName, setCompanyName] = useState("");
  const [shipTo, setShipTo] = useState("");
  const [shipToList, setShipToList] = useState([]);
  const [location, setLocation] = useState();
  const [addNewCompany, setAddNewCompany] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

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
          <Collapse in={addNewCompany}>
            <Typography variant="subtitle1" color="text.secondary">
              Thanks for registering, please check your contact email for set password!
            </Typography>
          </Collapse>
          <Collapse in={addNewCompany ? false : true}>
            <AddCompany
              setAddNewCompany={setAddNewCompany}
              toastUp={toastUp}
              setShipToList={setShipToList}
              setLocation={setLocation}
              setShipTo={setShipTo}
              setCompanyName={setCompanyName}
              setRefreshList={setRefreshList}
              refreshList={refreshList}
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
