import React, { useState, useRef, useCallback } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Collapse,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import { MuiFileInput } from "mui-file-input";
import { ImageComponent } from "src/components/image";
import { stringAvatar } from "src/helper/handelCompanyAvatar";
import { UpdateCompanyAvatarToMongo } from "src/service/use-mongo";

export const CompanyProfile = ({ company, toastUp }) => {
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [loadSave, setLoadSave] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [onAddFile, setOnAddFile] = useState(false);

  const avatarHeight = company.avatar ? "150px" : "100px";

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  async function handleChangeFile(newFile) {
    if (!newFile) {
      setFile();
      setPreview();
      return;
    }
    if (newFile.size < 200000) {
      const base64Img = await convertToBase64(newFile);
      setFile({ photo: newFile, base64File: base64Img });
      setPreview(URL.createObjectURL(newFile));
      setFileError(false);
    } else {
      setFileError(true);
    }
  }
  const handleUploadPhoto = useCallback(async () => {
    setLoadSave(true);
    const resUploadPhoto = await UpdateCompanyAvatarToMongo(company._id, file.base64File);

    if (!resUploadPhoto) {
      toastUp.handleStatus("error");
      toastUp.handleMessage("Error updating photo!");
    }
    setLoadSave(false);
    toastUp.handleStatus("success");
    toastUp.handleMessage("Company updated!");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const contact = company.contact.find((item) => item.default === true)

  return (
    <Card>
      <CardContent>
        <Box sx={{ textAlign: "center" }}>
          {preview ? (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                minHeight: "150px",
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <ImageComponent img={preview} title={company.name} />
            </Box>
          ) : (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                minHeight: avatarHeight,
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              {company.avatar ? (
                <ImageComponent img={company.avatar} title={company.name} />
              ) : (
                <Avatar {...stringAvatar(company.name)} />
              )}
            </Box>
          )}
          <Typography gutterBottom variant="h5">
            {company.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {contact.name} / {contact.email}
          </Typography>
        </Box>
      </CardContent>
      <Divider />

      <Collapse in={!onAddFile}>
        <CardActions>
          <Button fullWidth variant="text" onClick={() => setOnAddFile(true)}>
            Upload picture
          </Button>
        </CardActions>
      </Collapse>
      <Collapse in={onAddFile}>
        <CardActions sx={{ padding: "20px" }}>
          <MuiFileInput
            value={file?.photo}
            onChange={handleChangeFile}
            variant="outlined"
            name="companyPhoto"
            label="Please choose Photo max 200kb"
            inputProps={{ accept: ".png, .jpeg, .jpg" }}
            getInputText={(value) => (value ? file.photo.name : "")}
            fullWidth
            className={file ? "selected_file" : "empty"}
            helperText={fileError && "Image size is above 200kb"}
            error={fileError}
          />
        </CardActions>
        {preview && (
          <CardActions>
            <LoadingButton
              color="primary"
              loading={loadSave}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={handleUploadPhoto}
              sx={{
                margin: "0 auto 20px"
              }}
            >
              Upload picture
            </LoadingButton>
          </CardActions>
        )}
      </Collapse>
    </Card>
  );
};
