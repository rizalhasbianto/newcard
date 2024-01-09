import PropTypes from "prop-types";
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
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { stringAvatar } from "src/helper/handelCompanyAvatar";

export const UsersTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;
  const listNumber = page * 10;

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
                <TableCell>Phone</TableCell>
                <TableCell>Signed Up</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer, index) => {
                const createdAt = customer.signUpDate ? format(new Date(customer.signUpDate), "dd/MM/yyyy") : "";
                return (
                  <TableRow hover key={customer._id} sx={{ cursor: "pointer" }}>
                    <TableCell padding="checkbox">{index + listNumber + 1}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar {...stringAvatar(customer.name, "small")} />
                        <Typography variant="subtitle2">{customer.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>{customer.role}</TableCell>
                    <TableCell>{customer.status}</TableCell>
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
