import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Skeleton
} from "@mui/material";

export default function CardLoading() {
  return (
    <Card>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></TableCell>
              <TableCell><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></TableCell>
              <TableCell><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></TableCell>
              <TableCell><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></TableCell>
              <TableCell><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></TableCell>
              <TableCell><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></TableCell>
              <TableCell><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell padding="checkbox">
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
              </TableCell>
              <TableCell>
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
              </TableCell>
              <TableCell>
                <Stack alignItems="top" direction="row" spacing={2}>
                <Skeleton variant="circular" width={40} height={40} />
                  <Stack alignItems="left" direction="column" spacing={0}>
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  </Stack>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack alignItems="left" direction="column" spacing={1}>
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Stack>
              </TableCell>
              <TableCell>
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
              </TableCell>
              <TableCell>
                <Stack alignItems="flex-start" direction="row" spacing={1}>
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
