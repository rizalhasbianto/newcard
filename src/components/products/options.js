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

    return (
        <Grid
            container
            alignItems="center"
        >
            {
                props?.options?.map((opt,i) => {
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
                                value={opt.name+":"+props.selectedOpt[opt.name]}
                                exclusive
                                onChange={props.handleChange}
                                aria-label="Options"
                                sx={{
                                    display: 'block'
                                }}
                            >
                                {opt.values.map((item) => {
                                    return (

                                        <ToggleButton
                                            value={opt.name + ":" + item}
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