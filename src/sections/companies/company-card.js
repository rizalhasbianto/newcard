import PropTypes from "prop-types";
import ClockIcon from "@heroicons/react/24/solid/ClockIcon";
import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography } from "@mui/material";
import { ImageComponent } from "src/components/image";
import { stringAvatar } from "src/helper/handelCompanyAvatar";
import Link from "next/link";

const CompanyCard = (props) => {
  const { company, quoteTotal } = props;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardContent>
        <Link href={`/companies/${company._id}`}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pb: 3,
              mb: 2,
              position: "relative",
              width: "100%",
              height: "80px",
            }}
          >
            {company.avatar ? (
              <ImageComponent img={company.avatar} title={company.name} />
            ) : (
              <Avatar {...stringAvatar(company.name)} />
            )}
          </Box>
          <Typography align="center" gutterBottom variant="h5">
            {company.name}
          </Typography>
        </Link>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack alignItems="center" direction="row" spacing={1}>
          <SvgIcon color="action" fontSize="small">
            <ClockIcon />
          </SvgIcon>
          <Typography color="text.secondary" display="inline" variant="body2">
            {quoteTotal} open quote&lsquo;s
          </Typography>
        </Stack>
        {company.sales?.name && (
          <Stack alignItems="center" direction="row" spacing={1}>
            <SvgIcon color="action" fontSize="small">
              <PersonIcon />
            </SvgIcon>
            <Typography color="text.secondary" display="inline" variant="body2">
              {company.sales?.name}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default CompanyCard 