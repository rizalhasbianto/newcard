import PropTypes from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import { ImageComponent } from "src/components/image";
import Link from 'next/link'

export const CompanyCard = (props) => {
  const { company, quoteTotal } = props;

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    
    const splitName = name.split(' ')
    let inisial
    if(splitName.length > 1) {
      inisial = {
        sx: {
          bgcolor: stringToColor(name),
          width:"80px",
          height:"80px",
          fontSize: "28px"
        },
        children: `${splitName[0][0]}${splitName[1][0]}`,
      }
    } else {
      const splitOneName = name.split("")
      inisial = {
        sx: {
          bgcolor: stringToColor(name),
          width:"80px",
          height:"80px",
          fontSize: "28px"
        },
        children: `${splitOneName[0][0]}${splitOneName[1][0]}`,
      }
    }
    return inisial;
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <CardContent>
      <Link href={`/companies/edit-company?id=${company._id}`}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3,
            mb: 2,
            position: "relative",
            width: "100%",
            height: "80px"
          }}
        >
          {
            company.avatar 
            ? <ImageComponent img={company.avatar} title={company.name} />
            : <Avatar {...stringAvatar(company.name)}/>
          }
          
        </Box>
        <Typography
          align="center"
          gutterBottom
          variant="h5"
        >
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
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <ClockIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >
            {quoteTotal} open quote&lsquo;s
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <ArrowDownOnSquareIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >
            Detail
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

CompanyCard.propTypes = {
  company: PropTypes.object.isRequired
};
