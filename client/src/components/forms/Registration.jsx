import * as yup from "yup";
import { Formik, Field, Form } from "formik";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Form as SemanticForm,
  Segment,
  Header,
  Message,
  Container,
} from "semantic-ui-react";
import toast from "react-hot-toast";
import { useEffect, useState, useContext } from "react";
import UserContext from "../../contexts/UserContext";

const signupSchema = yup.object().shape({
  first_name: yup
    .string("First name has to be a string")
    .required("First name is required")
    .min(3)
    .max(20)
    .matches(/^[A-Za-z]+$/, "First name must only contain letters"),
  last_name: yup
    .string("Last name has to be a string")
    .required("Last name is required")
    .min(3)
    .max(20)
    .matches(/^[A-Za-z]+$/, "First name must only contain letters"),
  date_of_birth: yup
    .date("Date of birth has to be a string")
    .required("Date of birth is required"),
  gender: yup
    .string("Gender has to be a string")
    .oneOf([
      "female",
      "male",
      "cisgender",
      "transgender",
      "non-binary",
      "agender",
      "unsure",
      "not listed",
      "prefer not to answer",
    ]),
  address: yup.string("Address has to be a string").max(256),
  phone_number: yup
  .string("Phone number has to be a string")
  .matches(/^\d{3}-\d{3}-\d{4}$/, "Invalid phone number format"), 
  insurance_id: yup.string().max(12),
  email: yup
    .string("Email has to be a string")
    .email("Please enter a valid email")
    .required("Email is required")
    .min(2)
    .max(256),
  password_hash: yup
    .string("Password has to be a string")
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: yup
    .string("Password has to be a string")
    .required("Please confirm your password")
    .oneOf([yup.ref("password_hash"), null], "Passwords must match"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string("email has to be a string")
    .email("email must be valid")
    .max(256, "email must be 80 characters max")
    .required("email is required"),
  password_hash: yup
    .string("password has to be a string")
    .min(8, "password has to be at least 8 characters long")
    .max(50, "password must be 25 characters long max")
    .required("password is required"),
});

const initialValues = {
  first_name: "",
  last_name: "",
  date_of_birth: "",
  address: "",
  phone_number: "",
  gender: "",
  insurance_id: "",
  email: "",
  password_hash: "",
  confirmPassword: "",
};

const Registration = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { updateUser, currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.patient_id) {
        navigate("/patient-page");
      } else if (currentUser.doctor_id) {
        navigate("/doctor-page");
      }
    }
  }, [currentUser, navigate]);

  return (
    <Container>
      <Header as="h2" textAlign="center">
        {isLogin ? "Please Log in" : "Sign Up"}
      </Header>
      <Message>
        <Message.Header>
          {isLogin ? "Not a Member?" : "Already a member?"}
        </Message.Header>
        <p>
          <Button onClick={() => setIsLogin((current) => !current)} primary>
            {isLogin ? "Signup Now!" : "Login!"}
          </Button>
        </p>
      </Message>

      <Formik
        validationSchema={isLogin ? loginSchema : signupSchema}
        initialValues={initialValues}
        onSubmit={(formData, { setSubmitting }) => {
          const { confirmPassword, ...submitData } = formData;
          const finalUrl = isLogin ? "/api/v1/login" : "/api/v1/signup";
          fetch(finalUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submitData),
          })
            .then((resp) => {
              if (resp.ok) {
                resp.json().then((user) => {
                  updateUser(user);
                  if (user.patient_id) {
                    navigate("/patient-page");
                  } else if (user.doctor_id) {
                    navigate("/doctor-page");
                  }  
                });
              } else {
                resp.json().then((errorObj) => toast.error(errorObj.error));
              }
            })
            .catch((errorObj) => toast.error(errorObj.message))
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form className="ui form">
            {!isLogin && (
              <Segment>
                <Field name="first_name">
                  {({ field, meta }) => (
                    <SemanticForm.Input
                      {...field}
                      label="First Name"
                      placeholder="Enter first name"
                      error={meta.touched && meta.error ? meta.error : null}
                    />
                  )}
                </Field>

                <Field name="last_name">
                  {({ field, meta }) => (
                    <SemanticForm.Input
                      {...field}
                      label="Last Name"
                      placeholder="Enter last name"
                      error={meta.touched && meta.error ? meta.error : null}
                    />
                  )}
                </Field>

                <Field name="date_of_birth">
                  {({ field, meta }) => (
                    <SemanticForm.Input
                      {...field}
                      type="date"
                      label="Date of Birth"
                      error={meta.touched && meta.error ? meta.error : null}
                    />
                  )}
                </Field>

                <Field name="gender">
                  {({ field, meta }) => (
                    <SemanticForm.Field>
                      <label>Gender</label>
                      <select {...field}>
                        <option value="">Select Gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="cisgender">Cisgender</option>
                        <option value="transgender">Transgender</option>
                        <option value="non-binary">Non-Binary</option>
                        <option value="agender">Agender</option>
                        <option value="unsure">Unsure</option>
                        <option value="not listed">Not Listed</option>
                        <option value="prefer not to answer">
                          Prefer not to answer
                        </option>
                      </select>
                      {meta.touched && meta.error ? (
                        <div className="ui pointing red basic label">
                          {meta.error}
                        </div>
                      ) : null}
                    </SemanticForm.Field>
                  )}
                </Field>

                <Field name="address">
                  {({ field, meta }) => (
                    <SemanticForm.Input
                      {...field}
                      label="Address"
                      placeholder="Enter address"
                      error={meta.touched && meta.error ? meta.error : null}
                    />
                  )}
                </Field>

                <Field name="phone_number">
                  {({ field, meta }) => (
                    <SemanticForm.Input
                      {...field}
                      label="Phone Number"
                      placeholder="123-456-7890"
                      error={meta.touched && meta.error ? meta.error : null}
                    />
                  )}
                </Field>

                <Field name="insurance_id">
                  {({ field, meta }) => (
                    <SemanticForm.Input
                      {...field}
                      label="Insurance ID"
                      placeholder="Enter insurance ID"
                      error={meta.touched && meta.error ? meta.error : null}
                    />
                  )}
                </Field>

                <Field name="email">
                  {({ field, meta }) => (
                    <SemanticForm.Input
                      {...field}
                      type="email"
                      label="Email"
                      placeholder="Enter email"
                      error={meta.touched && meta.error ? meta.error : null}
                    />
                  )}
                </Field>

                <Field name="password_hash">
                  {({ field, meta }) => (
                    <SemanticForm.Input
                      {...field}
                      type="password"
                      label="Password"
                      placeholder="Enter password"
                      error={meta.touched && meta.error ? meta.error : null}
                    />
                  )}
                </Field>

                <Field name="confirmPassword">
                  {({ field, meta }) => (
                    <SemanticForm.Input
                      {...field}
                      type="password"
                      label="Confirm Password"
                      placeholder="Confirm password"
                      error={meta.touched && meta.error ? meta.error : null}
                    />
                  )}
                </Field>
              </Segment>
            )}

            {isLogin && (
              <>
                <Field name="email">
                  {({ field, meta }) => (
                    <SemanticForm.Input
                      {...field}
                      type="email"
                      label="Email"
                      placeholder="Enter email"
                      error={meta.touched && meta.error ? meta.error : null}
                    />
                  )}
                </Field>

                <Field name="password_hash">
                  {({ field, meta }) => (
                    <SemanticForm.Input
                      {...field}
                      type="password"
                      label="Password"
                      placeholder="Enter password"
                      error={meta.touched && meta.error ? meta.error : null}
                    />
                  )}
                </Field>
              </>
            )}

            <Button type="submit" color="blue" disabled={isSubmitting}>
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Registration;
