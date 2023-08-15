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
                            key={i}
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
                                    display: 'block',
                                    mt: '5px'
                                }}
                            >
                                {opt.values.map((item,index) => {
                                    return (

                                        <ToggleButton
                                            value={opt.name + ":" + item}
                                            key={index}
                                            sx={{
                                                display: 'inline-block',
                                                fontSize: '11px',
                                                padding: '5px'
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