import { useCallback, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { utcToZonedTime } from "date-fns-tz";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Unstable_Grid2 as Grid,
  MenuItem,
  TextField,
} from "@mui/material";

import { AddNewTicket, UpdateTicket } from "src/service/use-mongo";

const NewTicketForm = () => {
  const { data } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const formik = useFormik({
    initialValues: {
      category:"",
      subject: "",
      message: "",
      submit: null,
    },
    validationSchema: Yup.object({
      category: Yup.string().required("This field is required"),
      subject: Yup.string().max(60).required("This field is required"),
      message: Yup.string().max(10000).required("This field is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoading(true);
      const resNewTicket = await AddNewTicket({
        createdBy: data.user.detail,
        category: values.category,
        subject: values.subject,
        ticketMessages: [
          {
            from: data.user.name,
            role: data.user.detail.role,
            message: values.message,
            time:utcToZonedTime(new Date(), "America/Los_Angeles")
          },
        ],
        status:"New",
        createdAt:utcToZonedTime(new Date(), 'America/Los_Angeles'),
        lastUpdateAt:utcToZonedTime(new Date(), 'America/Los_Angeles')
      });
      if (!resNewTicket) {
        setMessage("Error send message, please try again later!");
      } else {
        setMessage("Your message has been sent, we will respon as soon as possible");
      }
      formik.values.submit = "submited";
      setLoading(false);
    },
  });

  return (
    <Card sx={{ mb: 2 }}>
      <Grid container justify="flex-end" alignItems="center">
        <Grid
          xs={6}
          md={6}
          sx={{
            padding: 0,
            mb: 2,
          }}
        >
          <CardHeader subheader="Please fill the form" title="Create New Ticket" />
        </Grid>
      </Grid>
      <CardContent sx={{ pt: 0 }}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Box>
            <Grid container spacing={2}>
              <Grid xl={4}>
                <TextField
                  id="category"
                  name="category"
                  label="Category"
                  variant="outlined"
                  fullWidth
                  select
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.category}
                  error={!!(formik.touched.category && formik.errors.category)}
                  helperText={formik.touched.category && formik.errors.category}
                >
                  <MenuItem value="Quote">
                    <em>Quote</em>
                  </MenuItem>
                  <MenuItem value="Order">
                    <em>Order</em>
                  </MenuItem>
                  <MenuItem value="Products">
                    <em>Products</em>
                  </MenuItem>
                  <MenuItem value="Other">
                    <em>Other...</em>
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid xl={8}>
              <TextField
                  id="subject"
                  name="subject"
                  label="Subject"
                  variant="outlined"
                  fullWidth
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.subject}
                  error={!!(formik.touched.subject && formik.errors.subject)}
                  helperText={formik.touched.subject && formik.errors.subject}
                />
              </Grid>
              <Grid xl={12}>
                <TextField
                  id="message"
                  name="message"
                  label="Message"
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={3}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.message}
                  error={!!(formik.touched.message && formik.errors.message)}
                  helperText={formik.touched.message && formik.errors.message}
                />
              </Grid>
              <Grid xl={12}>
                {formik.values.submit ? (
                  message
                ) : (
                  <LoadingButton
                    color="primary"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SendIcon />}
                    variant="contained"
                    type="submit"
                  >
                    Submit
                  </LoadingButton>
                )}
              </Grid>
            </Grid>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export const ReplyTicketForm = ({oldMessage, id, mutateData}) => {
  const { data } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const formik = useFormik({
    initialValues: {
      status:"Open",
      message: "",
      submit: null,
    },
    validationSchema: Yup.object({
      message: Yup.string().max(10000).required("This field is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoading(true);
      const resNewTicket = await UpdateTicket({
        id:id,
        data: {
          ticketMessages: [
            ...oldMessage,
            {
              from: data.user.name,
              role: data.user.detail.role,
              message: values.message,
              time:utcToZonedTime(new Date(), 'America/Los_Angeles')
            },
          ],
          status:values.status,
          lastUpdateAt:utcToZonedTime(new Date(), 'America/Los_Angeles')
        }
      });

      if (!resNewTicket) {
        setMessage("Error send message, please try again later!");
      } else {
        formik.resetForm()
        mutateData()
      }
      formik.values.submit = "submited";
      setLoading(false);
    },
  });

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Box>
            <Grid container spacing={2}>
            <Grid xl={4}>
                <TextField
                  id="status"
                  name="status"
                  label="Status"
                  variant="outlined"
                  fullWidth
                  select
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.status}
                  error={!!(formik.touched.status && formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                >
                  <MenuItem value="Open">
                    <em>Open</em>
                  </MenuItem>
                  <MenuItem value="Process">
                    <em>Process</em>
                  </MenuItem>
                  <MenuItem value="Closed">
                    <em>Closed</em>
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid xl={12}>
                <TextField
                  id="message"
                  name="message"
                  label="Message"
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={3}
                  onChange={formik.handleChange}
                  value={formik.values.message}
                  error={!!(formik.touched.message && formik.errors.message)}
                  helperText={formik.touched.message && formik.errors.message}
                />
              </Grid>
              <Grid xl={12}>
              <LoadingButton
                    color="primary"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SendIcon />}
                    variant="contained"
                    type="submit"
                  >
                    Submit
                  </LoadingButton>
                  <br/>
                {formik.values.submit &&  message}
              </Grid>
            </Grid>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewTicketForm