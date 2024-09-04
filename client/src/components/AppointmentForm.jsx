import { useState } from "react";
import { Container, Form, Button } from "semantic-ui-react";
import { useOutletContext, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as yup from "yup";

const appointmentSchema = yup.object().shape({
  date: yup
    .string()
    .required("Date is required")
    .matches(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      "Date must be in the format YYYY-MM-DD HH:MM:SS"
    ),
  reason: yup
    .string()
    .min(6, "Reason must be at least 6 characters")
    .max(50, "Reason must be at most 50 characters")
    .required("Reason is required"),
  status: yup
    .string()
    .oneOf(["scheduled", "completed", "canceled"], "Invalid status")
    .required("Status is required"),
  doctor_id: yup.number().required("Doctor ID is required").integer(),
  billing_id: yup.number().required("Billing ID is required").integer(),
  avs_id: yup.number().required("AVS ID is required").integer(),
});

const AppointmentForm = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    reason: "",
    status: "scheduled",
    doctor_id: "",
    billing_id: "",
    avs_id: "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Log the date field value as it's changed
    if (name === "date") {
      console.log("Date field value:", value);
    }

    // Convert numerical values to integers
    const newValue = name === "doctor_id" || name === "billing_id" || name === "avs_id" ? parseInt(value) : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  // Convert datetime-local value to the format required by the schema
  const formatDateTime = (datetime) => {
    const [datePart, timePart] = datetime.split('T');
    return `${datePart} ${timePart}:00`; // Adding seconds as `:00`
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert the date to the required format
    const formattedData = {
      ...formData,
      date: formatDateTime(formData.date),
    };

    console.log("Formatted data before validation:", formattedData);

    // Validate the formatted data with yup
    try {
      await appointmentSchema.validate(formattedData, { abortEarly: true });

      console.log("Form data after validation:", formattedData);

      // Make API request if validation passes
      fetch("/api/v1/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formattedData,
          patient_id: user.id, // Use current user's ID as patient_id
        }),
      })
        .then((resp) => {
          console.log("API response:", resp);
          if (resp.ok) {
            resp.json().then(() => {
              toast.success("Appointment created successfully!");
              navigate(`/appointments`);
            });
          } else {
            resp.json().then((errorObj) => {
              toast.error(errorObj.error || "Error creating appointment.");
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

  return (
    <Container>
      <h2>Schedule a New Appointment</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Date and Time"
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <Form.Input
          label="Reason"
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />
        <Form.Input
          label="Status"
          type="text"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        />
        <Form.Input
          label="Doctor ID"
          type="number"
          name="doctor_id"
          value={formData.doctor_id || ""}
          onChange={handleChange}
          required
        />
        <Form.Input
          label="Billing ID"
          type="number"
          name="billing_id"
          value={formData.billing_id || ""}
          onChange={handleChange}
          required
        />
        <Form.Input
          label="AVS ID"
          type="number"
          name="avs_id"
          value={formData.avs_id || ""}
          onChange={handleChange}
          required
        />
        <Button type="submit" primary>
          Create Appointment
        </Button>
      </Form>
    </Container>
  );
};

export default AppointmentForm;
