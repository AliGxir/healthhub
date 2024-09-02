import * as yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Button,
  Form as SemanticForm,
  Segment,
  Header,
  Message,
  Container,
  Image,
} from "semantic-ui-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";


const signupSchema = yup.object().shape({
  first_name: yup
    .string("First name has to be a string")
    .required("First name is required")
    .min(3)
    .max(20),
  last_name: yup
    .string("Last name has to be a string")
    .required("Last name is required")
    .min(3)
    .max(20),
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
    .string()
    .matches("^(d{3}) d{3}-d{4}$", "Invalid phone number"),
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
  const { updateUser, currentUser } = useOutletContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/appointments");
    }
  }, [currentUser, navigate]);

  return (
    <div>
      <h2>Please Log in or Sign Up</h2>
      <h3>{isLogin ? "Not a Member?" : "Already a member?"}</h3>
      <button onClick={() => setIsLogin((current) => !current)}>
        {isLogin ? "Signup Now!" : "Login!"}
      </button>
      <Formik
        validationSchema={isLogin ? loginSchema : signupSchema}
        initialValues={initialValues}
        onSubmit={(formData) => {
          const finalUrl = isLogin ? "/api/v1/login" : "/api/v1/signup";
          fetch(finalUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
            .then((resp) => {
              if (resp.ok) {
                resp.json().then((user) => {
                  updateUser(user);
                  navigate("/appointments");
                });
              } else {
                resp.json().then((errorObj) => toast.error(errorObj.error));
              }
            })
            .catch((errorObj) => toast.error(errorObj.message));
        }}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => (
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                />
                {errors.username && touched.username && (
                  <p className="error-message show">{errors.username}</p>
                )}
              </>
            )}
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {errors.email && touched.email && (
              <p className="error-message show">{errors.email}</p>
            )}
            <label htmlFor="password_hash">Password</label>
            <input
              type="password"
              name="password_hash"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password_hash}
            />
            {errors.password_hash && touched.password_hash && (
              <p className="error-message show">{errors.password_hash}</p>
            )}

            <input
              type="submit"
              value={isLogin ? "Login!" : "Create Account!"}
              disabled={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Registration;
