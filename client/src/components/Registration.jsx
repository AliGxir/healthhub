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

const signupSchema = yup.object().shape({
    first_name : yup.string().required("First name is required").min(3).max(20),
    last_name : yup.string().required("Last name is required").min(3).max(20),
    date_of_birth: yup.date().required("Date of birth is required"),
    gender: yup.string().oneOf([
        "female",
        "male",
        "cisgender",
        "transgender",
        "non-binary",
        "agender",
        "unsure",
        "not listed",
        "prefer not to answer"]),
    address: yup.string().max(256),
    phone_number: yup.string().matches("^\(\d{3}\) \d{3}-\d{4}$", "Invalid phone number"),
    insurance_id: yup.string().max(12),
    email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email is required")
        .min(2)
        .max(256),
    password_hash: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long"),
    confirmPassword:yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password_hash"), null], "Passwords must match")
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
    confirmPassword: ""
  };

const Registration = () => {
    return <></>
}

export default Registration;