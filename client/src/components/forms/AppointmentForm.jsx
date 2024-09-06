import { useState, useEffect, useContext } from "react";
import { Container, Form, Button } from "semantic-ui-react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useFormik } from "formik";

const appointmentSchema = yup.object().shape({
  date: yup
    .string()
    .matches(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      "Date must be in the format YYYY-MM-DD HH:MM:SS"
    ),
  reason: yup
    .string()
    .min(6, "Reason must be at least 6 characters")
    .max(50, "Reason must be at most 50 characters"),
  status: yup
    .string()
    .oneOf(["scheduled", "completed", "canceled"], "Invalid status"),
  doctor_id: yup.number().integer(),
  billing_id: yup.number().integer(),
  avs_id: yup.number().integer(),
});

const CreateOrUpdateAppointment = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const [formData, setFormData] = useState({
    date: "",
    reason: "",
    status: "scheduled",
    doctor_id: "",
    billing_id: "",
    avs_id: "",
  });

  useEffect(() => {
    if (appointmentId) {
      fetch(`/api/v1/appointments/${appointmentId}`)
        .then((resp) => {
          if (resp.ok) {
            return resp.json().then((data) => {
              setFormData({
                ...data,
                date: data.date.replace(" ", "T").slice(0, 16), // Convert date to datetime-local format
              });
            });
          } else {
            resp.json().then((errorObj) => toast.error(errorObj.error));
          }
        })
        .catch(() => toast.error("Failed to fetch appointment details."));
    }
  }, [appointmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newValue =
      name === "doctor_id" || name === "billing_id" || name === "avs_id"
        ? value === "" ? "" : parseInt(value)
        : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  // Convert datetime-local value to the format required by the schema
  const formatDateTime = (datetime) => {
    const [datePart, timePart] = datetime.split("T");
    return `${datePart} ${timePart}:00`; // Adding seconds as `:00`
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      date: formatDateTime(formData.date),
    };

    try {
      await appointmentSchema.validate(formattedData, { abortEarly: true });

      // Prepare data for PATCH request, removing fields that are empty
      const dataToSend = Object.fromEntries(
        Object.entries(formattedData).filter(([_, value]) => value !== "" && value !== null)
      );

      const method = appointmentId ? "PATCH" : "POST";
      const url = appointmentId
        ? `/api/v1/appointments/${appointmentId}`
        : "/api/v1/appointments";

      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...dataToSend,
          ...(appointmentId ? {} : { patient_id: user.id }), // Add patient_id only when creating
        }),
      })
        .then((resp) => {
          console.log("API response:", resp);
          if (resp.ok) {
            resp.json().then(() => {
              toast.success(
                appointmentId
                  ? "Appointment updated successfully!"
                  : "Appointment created successfully!"
              );
              navigate(`/appointments`);
            });
          } else {
            resp.json().then((errorObj) => {
              toast.error(
                errorObj.error || "Error processing the appointment."
              );
            });
          }
        })
        .catch(() => {
          toast.error("Network error.");
        });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Validation errors occurred.");
      }
    }
  };

  const handleBackClick = () => {
    if (user.patient_id) {
      navigate("/patients");
    } else if (user.doctor_id) {
      navigate("/doctors");
    } else {
      navigate("/");
    }
  };

  return (
    <Container>
        <div style={{ marginBottom: "20px" }}>
        <Button color="blue"  onClick={handleBackClick}>
          Back to Homepage
        </Button>

      </div>
      <h2>{appointmentId ? "Update Appointment" : "Schedule a New Appointment"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Date and Time"
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <Form.Input
          label="Reason"
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
        />
        <Form.Input
          label="Status"
          type="text"
          name="status"
          value={formData.status}
          onChange={handleChange}
        />
        <Form.Input
          label="Doctor ID"
          type="number"
          name="doctor_id"
          value={formData.doctor_id || ""}
          onChange={handleChange}
        />
        <Form.Input
          label="Billing ID"
          type="number"
          name="billing_id"
          value={formData.billing_id || ""}
          onChange={handleChange}
        />
        <Form.Input
          label="AVS ID"
          type="number"
          name="avs_id"
          value={formData.avs_id || ""}
          onChange={handleChange}
        />
        <Button type="submit" primary>
          {appointmentId ? "Update Appointment" : "Create Appointment"}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateOrUpdateAppointment;
