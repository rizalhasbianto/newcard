import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";

import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Collapse,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";

import UsersTable from "src/sections/users/users-table"; 
import UsersSearch from "src/sections/users/users-search";
import UsersAdd from "src/sections/users/user-add";

import TableLoading from "src/components/table-loading";
import { useToast } from "src/hooks/use-toast";
import Toast from "src/components/toast";
import { GetUsersSwr } from "src/service/use-mongo";

const Users = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addNewUser, setAddNewUser] = useState(false); 
  const [search, setSearch] = useState();
  const toastUp = useToast();
  const { data: session } = useSession();
  const sessionRole = {
    role:session?.user.detail.role,
    id:session?.user.detail.id
  } 

  const { data: users, isLoading, isError, mutate, isValidating } = GetUsersSwr({page, rowsPerPage, sessionRole, search});
console.log("users", users)
  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  useEffect(() => {
    if (isValidating) {
      toastUp.handleStatus("loading");
      toastUp.handleMessage("Validating data");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidating]);

  return (
    <>
      <Head>
        <title>Users | Skratch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Toast
            toastStatus={toastUp.toastStatus}
            handleStatus={toastUp.handleStatus}
            toastMessage={toastUp.toastMessage}
          />
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Users</Typography>
                {/* <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack> */}
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">{!addNewUser ? <PlusIcon /> : <CloseIcon />}</SvgIcon>
                  }
                  variant="contained"
                  onClick={() => setAddNewUser(!addNewUser)}
                >
                  {!addNewUser ? "Add" : "Cancel"}
                </Button>
              </div>
            </Stack>
            <Box sx={{ mb: 2 }}>
                      <UsersSearch setSearch={setSearch}/>
                    </Box>
            {isLoading && <TableLoading />}

            {(isError || (users && users.data.user.length === 0)) && (
              <Typography variant="h5" textAlign={"center"}>
                No data found!
              </Typography>
            )}

            {users && (
              <Box>
                {users.data.user.length > 0 && (
                  <Collapse in={!addNewUser}>
                    <UsersTable
                      count={users.data.count}
                      items={users.data.user}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      mutate={mutate}
                    />
                  </Collapse>
                )}
                <Collapse in={addNewUser}>
                  <Card sx={{ maxWidth: "800px", margin: "auto" }}>
                    <CardHeader subheader="Please fill the form" title="Add new user" />
                    <CardContent>
                      <UsersAdd
                        session={session}
                        toastUp={toastUp}
                        setAddNewUser={setAddNewUser}
                        mutateData={mutate}
                      />
                    </CardContent>
                  </Card>
                </Collapse>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Users;
