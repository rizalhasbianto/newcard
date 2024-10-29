import PropTypes from "prop-types";
import Link from "next/link";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { stringAvatar } from "src/helper/handelCompanyAvatar";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { UpdateUserStatus } from "src/service/use-mongo";

const UsersTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    mutate
  } = props;
  const listNumber = page * 10;

  const handleDeactive = async (id) => {
    const updateStatus = await UpdateUserStatus({ id: id, status: "disable" });
    mutate();
    console.log("updateStatus", updateStatus);
  };

  const handleReactive = async (id) => {
    const updateStatus = await UpdateUserStatus({ id: id, status: "active" });
    mutate();
    console.log("updateStatus", updateStatus);
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Signed Up</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer, index) => {
                const createdAt = customer.signUpDate
                  ? format(new Date(customer.signUpDate), "dd/MM/yyyy")
                  : "";
                return (
                  <TableRow hover key={customer._id} sx={{opacity:customer.status === "active" ? 1 : "0.5"}}>
                    <TableCell padding="checkbox">{index + listNumber + 1}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar {...stringAvatar(customer.name, "small")} />
                        <Typography variant="subtitle2">{customer.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.company?.companyName}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>{customer.role}</TableCell>
                    <TableCell>{customer.status}</TableCell>
                    <TableCell>
                      <Stack alignItems="flex-start" direction="row" spacing={1}>
                        <Link href={`/dashboard/users/${customer._id}`} passHref>
                          <SvgIcon className="action" color="action" fontSize="small">
                            <PencilIcon />
                          </SvgIcon>
                        </Link>
                        {customer.status === "active" ? (
                          <SvgIcon
                            className="action"
                            color="action"
                            fontSize="small"
                            onClick={() => handleDeactive(customer._id)}
                          >
                            <VisibilityOffIcon />
                          </SvgIcon>
                        ) : (
                          <SvgIcon
                            className="action"
                            color="action"
                            fontSize="small"
                            onClick={() => handleReactive(customer._id)}
                          >
                            <VisibilityIcon />
                          </SvgIcon>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Card>
  );
};

export default UsersTable;
