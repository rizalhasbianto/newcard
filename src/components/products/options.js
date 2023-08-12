import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    MenuItem,
    ListItemText,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Unstable_Grid2 as Grid
} from '@mui/material';

export default function OptionsComponent(props) {
    const [alignment, setAlignment] = useState('web');
    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };
    return (
        <Grid
            container
            alignItems="center"
        >
            {
                props?.options?.map((opt) => {
                    return (
                        <Grid
                            xs={12}
                            key={opt.name}
                            sx={{
                                pt: 0
                            }}
                        >
                            <Typography
                                variant="body2"
                            >
                                {opt.name}
                            </Typography>
                            <ToggleButtonGroup
                                color="primary"
                                value={alignment}
                                exclusive
                                onChange={handleChange}
                                aria-label="Options"
                                sx={{
                                    display: 'block'
                                }}
                            >
                                {opt.values.map((item) => {
                                    return (

                                        <ToggleButton
                                            value={item}
                                            key={opt.name + "-" + item}
                                            sx={{
                                                display: 'inline-block'
                                            }}
                                        >
                                            {item}
                                        </ToggleButton>
                                    )
                                })}
                            </ToggleButtonGroup>
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}