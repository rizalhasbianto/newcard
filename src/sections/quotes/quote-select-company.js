import { useCallback } from 'react';
import {
    TextField,
    MenuItem,
    ListItemText,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { companySample } from 'src/data/company'

export default function QuoteSelectCompany(props) {
    const {
        location,
        shipToList,
        shipTo,
        companyName,
        setShipToList,
        setLocation,
        setShipTo,
        setCompanyName
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
                const shipToList = companySample.find((company) => company.name === event.target.value)
                setShipTo(shipToList.shipTo[0].locationName)
                setShipToList(shipToList.shipTo)
                setLocation(shipToList.shipTo[0].location)
            } else {
                const locationList = data.find((ship) => ship.locationName === event.target.value)
                setShipTo(event.target.value)
                setLocation(locationList.location)
            }
        },
        []
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
                        value={companyName}
                        select
                        fullWidth
                        required
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {companySample.map((option) => (
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
            {
                location &&
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        xs={12}
                        md={6}
                    >
                        <ListItemText
                            primary="Shipping"
                            secondary={
                                <>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {location.address}
                                    </Typography>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {location.city} {location.state}, {location.zip}
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
                    <Grid
                        xs={12}
                        md={6}
                    >
                        <ListItemText
                            primary="Billing"
                            secondary="Jan 9, 2014"
                        />
                    </Grid>
                </Grid>
            }
        </>
    )
}