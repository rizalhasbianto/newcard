import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Checkbox,
    Divider,
    Select,
    MenuItem,
    Unstable_Grid2 as Grid,
    InputLabel,
    Autocomplete,
    CardActions,
    Stack
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { MuiFileInput } from 'mui-file-input'
import { usaState } from 'src/data/state-usa'

export default function AddCompany(props) {
    const { setAddNewCompany } = props
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    const [state, setState] = useState();
    const [country, setCountry] = useState("USA");
    const newUsaState = usaState.map((st) => {
        return ({
            label: st.name
        })
    })
    function handleChange(newFile) {
        if (!newFile) {
            setFile();
            setPreview();
            return
        }
        setFile(newFile);
        setPreview(URL.createObjectURL(newFile));
    }
    return (
        <>
            <Stack
            sx={{
                marginBottom: "30px"
            }}>
                <Grid container>
                    <Grid
                        xs={12}
                        md={12}
                    >
                        <Divider textAlign="left">Company Info</Divider>
                    </Grid>
                    <Grid
                        xs={12}
                        md={3}
                    >
                        <TextField
                            id="company-name"
                            name="company-name"
                            label="Company Name"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <TextField
                            id="company-about"
                            name="company-about"
                            label="Company about"
                            variant="outlined"
                            fullWidth
                            multiline
                            maxRows={3}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <MuiFileInput
                            value={file}
                            onChange={handleChange}
                            variant="outlined"
                            label="Please choose Photo max 1mb"
                            inputProps={{ accept: '.png, .jpeg, .jpg' }}
                            getInputText={(value) => value ? file.name : ''}
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={1}
                    >
                        <Checkbox
                            icon={<BookmarkBorderIcon />}
                            checkedIcon={<BookmarkIcon />}
                        />
                    </Grid>
                </Grid>
            </Stack>
            <Stack
            sx={{
                marginBottom: "30px"
            }}>
                <Grid container>
                    <Grid
                        xs={12}
                        md={12}
                    >
                        <Divider textAlign="left">Shipping</Divider>
                    </Grid>
                    <Grid
                        xs={12}
                        md={5}
                    >
                        <TextField
                            id="company-shipping-location"
                            name="company-shipping-location"
                            label="Shipping Location Name"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={2}
                    >
                        <TextField
                            id="country-name"
                            name="country-name"
                            label="Country"
                            value={country}
                            select
                            fullWidth
                            required
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            <MenuItem value="USA">
                                <em>USA</em>
                            </MenuItem>
                        </TextField>
                    </Grid>
                    <Grid
                        xs={12}
                        md={5}
                    >
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={newUsaState}
                            fullWidth
                            renderInput={(params) => <TextField {...params}
                                label="State" />}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={6}
                    >
                        <TextField
                            id="attention-location"
                            name="attention-location"
                            label="Attention"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={6}
                    >
                        <TextField
                            id="address-location"
                            name="address-location"
                            label="Address"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <TextField
                            id="city-location"
                            name="city-location"
                            label="City"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <TextField
                            id="postal-location"
                            name="postal-location"
                            label="Postal"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <TextField
                            id="phone-location"
                            name="phone-location"
                            label="Phone"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Stack>
            <Stack>
                <Grid container>
                    <Grid
                        xs={12}
                        md={12}
                    >
                        <Divider textAlign="left">Contact</Divider>
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <TextField
                            id="contact-first-name"
                            name="contact-first-name"
                            label="First Name"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <TextField
                            id="contact-last-name"
                            name="contact-last-name"
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <TextField
                            id="contact-email"
                            name="contact-email"
                            label="Email"
                            variant="outlined"
                            type={"email"}
                            fullWidth
                        />
                    </Grid>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <LoadingButton
                            color="primary"
                            onClick={() => setAddNewCompany()}
                            loading={false}
                            loadingPosition="start"
                            startIcon={<CancelIcon />}
                            variant="contained"
                        >
                            Cancel
                        </LoadingButton>
                        <LoadingButton
                            color="primary"
                            //onClick={() => handleSubmit()}
                            loading={false}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained"
                        >
                            Save
                        </LoadingButton>
                    </CardActions>
                </Grid>
            </Stack>
        </>
    )
}