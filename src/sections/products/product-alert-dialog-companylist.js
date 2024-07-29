import { useCallback, useEffect, useState } from "react";
import { GetCompanies } from "src/service/use-mongo";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Avatar,
  Stack,
  Checkbox,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import { dialogComapnyListHead } from "src/data/tableList";
import { useRouter } from "next/router";

export default function ProductAddToQuote(props) {
  const { session, openCompany, setOpenCompany, catalogCompany, setCatalogCompany } = props;
  const [dialogCompanyList, setDialogCompanyList] = useState([]);
  const router = useRouter();

  const handleSelectCompany = (id, name, e) => {
    if (e.target.checked) {
      setCatalogCompany([...catalogCompany, {id, name}]);
    } else {
      const findCompanyIndex = catalogCompany.findIndex((itm) => itm.id === id);
      catalogCompany.splice(findCompanyIndex, 1);
      setCatalogCompany([...catalogCompany]);
    }
  };

  const handleOpenCompanyList = async () => {
    let companies;
    if (session?.user?.detail?.role === "sales") {
      companies = await GetCompanies({
        query: { "sales.id": session?.user?.detail?.id },
      });
    } else {
      companies = await GetCompanies({ page: 0 });
    }
    setDialogCompanyList(companies.data.company);
  };

  useEffect(() => {
    if (openCompany && dialogCompanyList.length === 0) {
      handleOpenCompanyList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCompany]);

  return (
    <Dialog
      open={openCompany}
      onClose={() => setOpenCompany(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ maxWidth: "100%" }}
    >
      <DialogTitle id="alert-dialog-title">Please choose the company</DialogTitle>
      <DialogContent sx={{ width: "800px" }}>
        <Table>
          <TableHead>
            <TableRow>
              {dialogComapnyListHead.map((head) => {
                return <TableCell key={head.title}>{head.title}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {dialogCompanyList.length > 0 &&
              dialogCompanyList.map((company, i) => {
                const contact = company.contacts.find((itm) => itm.default);
                const checkStatus = catalogCompany.findIndex((itm) => itm.id === company.shopifyCompanyLocationId)
                return (
                  <TableRow hover selected={true} key={i + 1}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        onChange={(e) => handleSelectCompany(company.shopifyCompanyLocationId, company.name, e)}
                        checked={checkStatus < 0 ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="right" direction="column" spacing={1}>
                        <Typography variant="subtitle2">{company.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="right" direction="column" spacing={1}>
                        <Typography variant="subtitle2">
                          {contact.detail.name} / {contact.detail.email}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="right" direction="column" spacing={1}>
                        {company.catalogIDs.map((catalog, idx) => (
                          <Typography variant="subtitle2" key={idx + 1}>
                            {catalog}
                          </Typography>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{company.sales.name}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenCompany(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
