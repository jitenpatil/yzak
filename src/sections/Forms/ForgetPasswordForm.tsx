import * as Yup from "yup";
import {
  Link as RouterLink,
  useNavigate,
  useOutletContext
} from "react-router-dom";
import { useFormik, Form, FormikProvider } from "formik";
import { useContext, useEffect } from "react";
// material
import { Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setUserAuthInfo } from '../../redux/slices/auth';
// component

// ----------------------------------------------------------------------

export default function ForgetPasswordForm() {
  const navigate = useNavigate();

  // const { getUserLogin } = useLoginService();
  const { setFlow } = useOutletContext() as any;

  const authValues = useAppSelector((state: any) => state.auth);
  const dispatch = useAppDispatch();

  const ForgetPasswordSchema = Yup.object().shape({
    email: Yup.string().required("Email ID is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits")
      .required("Phone Number is required")
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      phoneNumber: ""
    },
    validationSchema: ForgetPasswordSchema,

    onSubmit: async (values: any) => {
      setFlow("FORGET_PASSWORD");
      // setUserDetails({
      //   email: values.email,
      //   phoneNumber: values.phoneNumber
      // });

      dispatch(setUserAuthInfo({
        email:  values.email,
        phoneNumber: values.phoneNumber,
      } as any));
      navigate("/verify");
    }
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps
  } = formik;

  useEffect(() => {
    if (authValues.userAuthInfo.email) {
      formik.setFieldValue("email", authValues.userAuthInfo.email);
    }
  }, [authValues.userAuthInfo.email]);
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ my: 2 }}>
          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            label="Email ID"
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
        </Stack>
        <Stack spacing={3} sx={{ my: 2 }}>
          <TextField
            fullWidth
            autoComplete="phoneNumber"
            type="text"
            label="Phone Number"
            {...getFieldProps("phoneNumber")}
            error={Boolean(touched.phoneNumber && errors.phoneNumber)}
            helperText={touched.phoneNumber && errors.phoneNumber}
          />
        </Stack>
        <Stack spacing={3} sx={{ my: 2 }}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Generate Otp
          </LoadingButton>
        </Stack>
        <LoadingButton
          fullWidth
          size="large"
          type="button"
          variant="outlined"
          // loading={isSubmitting}
          onClick={() => navigate("/login")}
        >
          Back
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
