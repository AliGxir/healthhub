import { useState, useEffect, useContext } from "react";
import { Container, Form, Button, Dropdown } from "semantic-ui-react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import toast from "react-hot-toast";
import * as yup from "yup";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";

const appointmentSchema = yup.object().shape({
  date: yup
    .string()
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      "Date must be in the format YYYY-MM-DDTHH:MM"
    )
    .required("Date is required"),
  reason: yup
    .string()
    .min(6, "Reason must be at least 6 characters")
    .max(50, "Reason must be at most 50 characters")
    .required("Reason is required"),
  status: yup
    .string()
    .oneOf(["scheduled", "completed", "canceled"], "Invalid status")
    .required("Status is required"),
  doctor_id: yup.number().integer().required("Doctor is required"),
  billing_id: yup.number().integer().nullable().moreThan(0, "Billing ID must be greater than 0"),
  avs_id: yup.number().integer().nullable().moreThan(0, "Billing ID must be greater than 0"),
});

const CreateOrUpdateAppointment = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [initialValues, setInitialValues] = useState({
    date: "",
    reason: "",
    status: "scheduled",
    doctor_id: "",
    billing_id: "",
    avs_id: "",
  });

  useEffect(() => {
    fetch("/api/v1/all-doctors")
      .then((resp) => resp.json())
      .then((data) =>
        setDoctors(
          data.map((doctor) => ({
            key: doctor.id,
            text: `Dr. ${doctor.first_name} ${doctor.last_name}`,
            value: doctor.id,
          }))
        )
      )
      .catch(() => toast.error("Failed to fetch doctors list."));
  }, []);

  useEffect(() => {
    if (appointmentId) {
      fetch(`/api/v1/appointments/${appointmentId}`)
        .then((resp) => resp.json())
        .then((data) => {
          setInitialValues({
            ...data,
            date: data.date.replace(" ", "T").slice(0, 16), // Convert date to datetime-local format
          });
        })
        .catch(() => toast.error("Failed to fetch appointment details."));
    }
  }, [appointmentId]);


  const handleSubmit = async (values) => {
    const formattedData = {
      ...values,
      date: `${values.date}:00`, // Adding seconds to the time format
    };

    try {
      const method = appointmentId ? "PATCH" : "POST";
      const url = appointmentId
        ? `/api/v1/appointments/${appointmentId}`
        : "/api/v1/appointments";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formattedData,
          ...(appointmentId ? {} : { patient_id: user.id }), // Add patient_id only when creating
        }),
      });

      if (response.ok) {
        toast.success(
          appointmentId
            ? "Appointment updated successfully!"
            : "Appointment created successfully!"
        );
        navigate(`/appointments`);
      } else {
        const errorObj = await response.json();
        toast.error(errorObj.error || "Error processing the appointment.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  return (
    <Container>
      <h2>
        {appointmentId ? "Update Appointment" : "Schedule a New Appointment"}
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={appointmentSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true} // Ensures form is reset when initialValues change
      >
        {({ values, setFieldValue }) => (
          <FormikForm>
            <Form.Field>
              <label>Date and Time</label>
              <Field
                as={Form.Input}
                type="datetime-local"
                name="date"
                value={values.date}
              />
              <ErrorMessage
                name="date"
                component="div"
                className="ui pointing red basic label"
              />
            </Form.Field>

            <Form.Field>
              <label>Reason</label>
              <Field as={Form.Input} type="text" name="reason" />
              <ErrorMessage
                name="reason"
                component="div"
                className="ui pointing red basic label"
              />
            </Form.Field>

            <Form.Field>
              <label>Doctor</label>
              <Dropdown
                fluid
                search
                selection
                options={doctors}
                name="doctor_id"
                value={values.doctor_id}
                onChange={(e, { value }) => setFieldValue("doctor_id", value)}
              />
              <ErrorMessage
                name="doctor_id"
                component="div"
                className="ui pointing red basic label"
              />
            </Form.Field>

            {appointmentId && (
              <>
                <Form.Field>
                  <label>Status</label>
                  <Field as={Form.Input} type="text" name="status" />
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="ui pointing red basic label"
                  />
                </Form.Field>

                <Form.Field>
                  <label>Billing ID</label>
                  <Field as={Form.Input} type="number" name="billing_id" />
                  <ErrorMessage
                    name="billing_id"
                    component="div"
                    className="ui pointing red basic label"
                  />
                </Form.Field>

                <Form.Field>
                  <label>AVS ID</label>
                  <Field as={Form.Input} type="number" name="avs_id" />
                  <ErrorMessage
                    name="avs_id"
                    component="div"
                    className="ui pointing red basic label"
                  />
                </Form.Field>
              </>
            )}

            <Button type="submit" >
              {appointmentId ? "Update Appointment" : "Create Appointment"}
            </Button>
          </FormikForm>
        )}
      </Formik>
    </Container>
  );
};

export default CreateOrUpdateAppointment;