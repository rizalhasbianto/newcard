import { useCallback } from 'react';
import {
    TextField,
    MenuItem,
    ListItemText,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';

export default function QuoteSelectCompany(props) {
    const {
        companies,
        location,
        shipToList,
        shipTo,
        companyName,
        companyContact,
        companySales,
        setShipToList,
        setLocation,
        setShipTo,
        setCompanyName,
        setCompanyContact,
        setCompanySales
    } = props

    const handleChange = useCallback(
        (event, data) => {
            if (event.target.name === "companyName") {
                setCompanyName(event.target.value)
                if (!event.target.value) {
                    setShipToList([])
                    setShipTo("")
                    setLocation("")
                    return
                }
                const selectedCompany = companies.find((company) => company.name === event.target.value)
                setShipTo(selectedCompany.shipTo[0].locationName)
                setShipToList(selectedCompany.shipTo)
                setLocation(selectedCompany.shipTo[0].location)
                setCompanySales(selectedCompany.sales)
                
            } else {
                const locationList = data.find((ship) => ship.locationName === event.target.value)
                setShipTo(event.target.value)
                setLocation(locationList.location)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [companies, setCompanyContact, setCompanyName, setLocation, setShipTo, setShipToList]
    );

    return (
        <>
            <Grid
                container
                spacing={1}
            >
                <Grid
                    xs={12}
                    md={6}
                >
                    <TextField
                        id="companyName"
                        name="companyName"
                        label="Company"
                        variant="outlined"
                        value={companyName}
                        select
                        fullWidth
                        required
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {companies.map((option) => (
                            <MenuItem
                                key={option.name}
                                value={option.name}
                            >
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid
                    xs={12}
                    md={6}
                >
                    <TextField
                        fullWidth
                        label="Ship To"
                        name="shipTo"
                        variant="outlined"
                        onChange={(e) => handleChange(e, shipToList)}
                        required
                        select
                        value={shipTo ?? " "}
                        defaultValue={shipTo ?? ""}
                    >
                        {!companyName &&
                            <MenuItem value="">
                                <em>Please select company first</em>
                            </MenuItem>
                        }
                        {shipToList.map((option) => (
                            <MenuItem
                                key={option.locationName}
                                value={option.locationName}
                            >
                                {option.locationName}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
            <Grid
                container
                spacing={1}
            >
                <Grid
                    xs={12}
                    md={6}
                >
                    {companyName &&
                        <Grid
                            container
                            spacing={1}
                        >
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <ListItemText
                                    primary="Email"
                                    secondary={companyContact?.detail.email}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <ListItemText
                                    primary="Name"
                                    secondary={companyContact?.detail.name}
                                />
                            </Grid>
                        </Grid>
                    }
                </Grid>
                {
                    location &&
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            xs={12}
                            md={12}
                        >
                            <ListItemText
                                primary="Shipping Address"
                                secondary={
                                    <>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {location.address + " "}
                                        </Typography>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {location.city} {location.state}, {location.zip + " "}
                                        </Typography>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            United States
                                        </Typography>
                                    </>
                                } />
                        </Grid>
                    </Grid>
                }
            </Grid>
        </>
    )
}