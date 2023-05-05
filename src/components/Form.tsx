import React, { useState, useRef, useEffect } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import { StepperHeader } from "./StepperHeader";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import { Box, Checkbox, FormHelperText, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { baseUrl } from "@/constants";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
let flag = true;
export default function Form() {
  const [activeStep, setActiveStep] = useState(0);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const OpenFilePicker = () => {
    if (filePickerRef?.current?.click) {
      filePickerRef.current.click();
    }
  };

  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [fileArr, setFileArr] = useState<Array<string>>();

  const pickedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
      setFieldValue("files", e.target.files);
      const fileList = [];
      for (let index = 0; index < e.target.files.length; index++) {
        fileList.push(e.target.files[index].name);
      }
      setFileArr(fileList);
    }
  };
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

  const schema = yup.object().shape({
    companyUEN: yup
      .string()
      .required("Company UEN is required")
      .min(10)
      .max(12),
    companyName: yup
      .string()
      .required("Company Name is required")
      .min(3)
      .max(20),
    fullName: yup.string().min(5).max(40).required("Full Name is required"),
    position: yup.string().min(5).max(20).required("Position is required"),
    email: yup
      .string()
      .required("Email is required")
      .matches(emailRegex, "Valid Email is requied"),
    phoneNumber: yup
      .string()
      .required("Phone Number is required")
      .matches(/[1-9]{1}[0-9]{9}/, "Valid Phone Number is required")
      .min(10)
      .max(10),
    reEmail: yup
      .string()
      .required("ReEnter Email Address")
      .oneOf([yup.ref("email")], "Email not matched"),
    termsAndCondition: yup
      .boolean()
      .oneOf([true], "Accept terms and condition"),
    files: yup
      .mixed()
      .required("Please upload PDF file/s")
      .test(
        "FILE_FORMAT",
        "Uploaded file has unsupported format.",
        (value: any) => {
          if (value && value?.length > 0) {
            for (let i = 0; i < value?.length; i++) {
              if (value[i]?.type != "application/pdf") {
                return false;
              }
            }
          }
          return true;
        }
      ),
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      companyUEN: "",
      companyName: "",
      fullName: "",
      position: "",
      reEmail: "",
      email: "",
      phoneNumber: "",
      termsAndCondition: false,
      files: [],
    },
    validationSchema: schema,
    onSubmit: async (values, action) => {
      const formData = new FormData();
      for (const file of values.files) {
        formData.append("files", file);
      }
      formData.append("companyUEN", values.companyUEN);
      formData.append("companyName", values.companyName);
      formData.append("companyFullName", values.fullName);
      formData.append("position", values.position);
      formData.append("email", values.email);
      formData.append("reEmail", values.reEmail);
      formData.append("phoneNumber", values.phoneNumber);
      const url = baseUrl + "/uploadForm";
      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          router.push("/thankyou");
        })
        .catch((err) => {
          toast.error("Something Went Wrong");
        });
    },
  });
  useEffect(() => {
    if (activeStep == 0) {
      if (
        touched.companyUEN &&
        !errors.companyUEN &&
        touched.companyName &&
        !errors.companyName
      ) {
        handleNext();
      } else {
        setActiveStep(0);
      }
    }

    if (activeStep == 1) {
      if (
        touched.fullName &&
        !errors.fullName &&
        touched.position &&
        !errors.position &&
        touched.email &&
        !errors.email &&
        touched.reEmail &&
        !errors.reEmail &&
        touched.phoneNumber &&
        !errors.phoneNumber
      ) {
        handleNext();
      } else {
        setActiveStep(1);
      }
    }

    if (activeStep == 2) {
      if (values.files.length !== 0) {
        setActiveStep(3);
      }
    }

    if (values.termsAndCondition) {
      handleNext();
    } else {
      if (activeStep == 2) {
        setActiveStep(3);
      }
    }
  }, [errors, touched, values.files.length]);

  useEffect(() => {
    if (values.files.length === 0 && activeStep === 3) {
      setActiveStep(2);
    }
  }, [values.files.length]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <>
      <Header />
      <Container>
        <Paper elevation={3}>
          <form
            noValidate
            onSubmit={handleSubmit}
            style={{ padding: "35px" }}
            encType="multipart/form-data"
          >
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>
                  <StepperHeader>Company Information</StepperHeader>
                </StepLabel>
                <StepContent TransitionProps={{ in: true }}>
                  <Grid container spacing={8}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoComplete="off"
                        inputProps={{ maxLength: 12 }}
                        name="companyUEN"
                        type="text"
                        sx={{ mt: 1, width: "100%" }}
                        label="Company UEN"
                        value={values.companyUEN}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.companyUEN && !!errors.companyUEN}
                        helperText={touched.companyUEN ? errors.companyUEN : ""}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        autoComplete="off"
                        inputProps={{ maxLength: 20 }}
                        name="companyName"
                        type="text"
                        sx={{ mt: 1, width: "100%" }}
                        label="Company Name"
                        value={values.companyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.companyName && !!errors.companyName}
                        helperText={
                          touched.companyName ? errors.companyName : ""
                        }
                      />
                      <Button
                        onClick={handleNext}
                        style={{ display: "none" }}
                      ></Button>
                    </Grid>
                  </Grid>
                </StepContent>
              </Step>

              <Step>
                <StepLabel>
                  <StepperHeader>Applicant Information</StepperHeader>
                </StepLabel>
                <StepContent TransitionProps={{ in: true }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoComplete="off"
                        inputProps={{ maxLength: 40 }}
                        label="Full Name"
                        name="fullName"
                        type="text"
                        sx={{ mt: 1, width: "100%" }}
                        value={values.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.fullName && !!errors.fullName}
                        helperText={touched.fullName ? errors.fullName : ""}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoComplete="off"
                        name="position"
                        type="text"
                        sx={{ mt: 1, width: "100%" }}
                        label="Position within company"
                        value={values.position}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.position && !!errors.position}
                        helperText={touched.position ? errors.position : ""}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoComplete="off"
                        inputProps={{ maxLength: 30 }}
                        name="email"
                        type="email"
                        sx={{ mt: 1, width: "100%" }}
                        label="Email Address"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && !!errors.email}
                        helperText={touched.email ? errors.email : ""}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoComplete="off"
                        inputProps={{ maxLength: 30 }}
                        name="reEmail"
                        type="email"
                        sx={{ mt: 1, width: "100%" }}
                        label="Re-enter Email Address"
                        value={values.reEmail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.reEmail && !!errors.reEmail}
                        helperText={touched.reEmail ? errors.reEmail : ""}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        autoComplete="off"
                        inputProps={{ maxLength: 10 }}
                        name="phoneNumber"
                        type="tel"
                        sx={{ mt: 1, width: "100%" }}
                        label="Phone Number"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phoneNumber && !!errors.phoneNumber}
                        helperText={
                          touched.phoneNumber ? errors.phoneNumber : ""
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              +91
                            </InputAdornment>
                          ),
                        }}
                      ></TextField>
                    </Grid>
                  </Grid>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>
                  <StepperHeader>Upload Documents</StepperHeader>
                </StepLabel>
                <StepContent TransitionProps={{ in: true }}>
                  <Box
                    component="div"
                    sx={{ mt: 1, p: 2, border: "1px dashed grey" }}
                  >
                    <input
                      accept="application/pdf"
                      id="file"
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      ref={filePickerRef}
                      onChange={pickedHandler}
                    />
                    <Button
                      style={{ width: "100%", padding: "8px" }}
                      onClick={OpenFilePicker}
                    >
                      Click to upload Files
                    </Button>
                  </Box>

                  {errors.files && (
                    <FormHelperText style={{ color: "red" }}>
                      {errors.files}
                    </FormHelperText>
                  )}

                  {!errors.files &&
                    fileArr?.map((name) => <p key={name}>{name}</p>)}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>
                  <StepperHeader>Terms & Conditions</StepperHeader>
                </StepLabel>
                <StepContent TransitionProps={{ in: true }}>
                  <FormHelperText style={{ color: "red" }}>
                    {touched.termsAndCondition && errors.termsAndCondition}
                  </FormHelperText>
                  <Typography>
                    <Checkbox
                      value={false}
                      name="termsAndCondition"
                      checked={values.termsAndCondition}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    By ticking, you are confirming that you have understood and
                    are agreeing to the details mentioned:
                  </Typography>
                  <br />
                  <br />
                  <Container>
                    <Typography>
                      &#10003; I confirm that I am the authorized person to
                      upload bank statements on behalf of my company
                      <br />
                      <br />
                      &#10003; I assure you that uploaded bank statements and
                      provided company information match and are of the same
                      company, if there is a mismatch then my report will not be
                      generated
                      <br />
                      <br />
                      &#10003; I understand that this is a general report based
                      on the bank statements and Credilinq is not providing a
                      solution or guiding me for my business growth
                      <br />
                      <br />
                      &#10003; I have read and understand the Terms & Conditions
                    </Typography>
                  </Container>
                </StepContent>
                <Box display="flex" justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="secondary">
                    Submit
                  </Button>
                </Box>
              </Step>
            </Stepper>
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}
