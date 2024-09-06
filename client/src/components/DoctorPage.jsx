import { useEffect, useState } from "react";
import { Container, Grid, Card, Button, Header } from "semantic-ui-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";

const DoctorPage = () => {
  const { user, updateUser } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    fetch(`/api/v1/appointments`)
      .then((resp) => {
        if (resp.ok) {
          return resp.json().then((data) => {
            setAppointments(data); 
          });
        } else {
          resp.json().then((errorObj) => toast.error(errorObj.error));
        }
      })
      .catch((errorObj) => toast.error(errorObj.message));
  }, [user, navigate]);

  const handleUpdateClick = (appointmentId) => {
    navigate(`/appointments/update/${appointmentId}`);
  };

  const handleDeleteClick = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      fetch(`/api/v1/appointments/${appointmentId}`, {
        method: "DELETE",
      })
        .then((resp) => {
          if (resp.ok) {
            setAppointments((prevAppointments) =>
              prevAppointments.filter((appointment) => appointment.id !== appointmentId)
            );
            toast.success("Appointment canceled successfully!");
          } else {
            resp.json().then((errorObj) => toast.error(errorObj.error));
          }
        })
        .catch(() => toast.error("Network error."));
    }
  };

  const handleLogout = () => {
    fetch("/api/v1/logout", {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 204) {
        updateUser(null);
        navigate("/");
      } else {
        toast.error("Failed to log out.");
      }
    });
  };

  return (
    <Container>
      <div style={{ marginBottom: "20px" }}>
        <Button color="blue" onClick={() => navigate("/appointments")}>
          Appointments
        </Button>
        <Button color="purple" onClick={() => navigate("/prescriptions")}>
          Prescriptions
        </Button>
        <Button color="teal" onClick={() => navigate("/avss")}>
          AVS
        </Button>
        <Button color="pink" onClick={() => navigate("/patients-list")}>
          Patient List
        </Button>
        <Button color="red" onClick={handleLogout} style={{ marginLeft: '20px' }}>
          Logout
        </Button>
      </div>

      {/* Header for Upcoming Appointments */}
      <Header as="h2" textAlign="center" style={{ marginBottom: "20px" }}>
        Upcoming Appointments
      </Header>

      <Grid>
        <Grid.Row>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <Grid.Column key={appointment.id} computer={4}>
                <Card>
                  <Card.Content>
                    <Card.Header>Appointment ID: {appointment.id}</Card.Header>
                    <Card.Meta>
                      Date: {new Date(appointment.date).toLocaleDateString()}
                    </Card.Meta>
                    <Card.Description>
                      <p>Reason: {appointment.reason}</p>
                      <p>Status: {appointment.status}</p>
                      <p>Patient: {appointment.patient_id}</p>
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      primary
                      onClick={() => handleUpdateClick(appointment.id)}
                    >
                      Update
                    </Button>
                    <Button
                      negative
                      onClick={() => handleDeleteClick(appointment.id)}
                    >
                      Cancel
                    </Button>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          ) : (
            <Grid.Column>
              <p>No upcoming appointments found.</p>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default DoctorPage;
