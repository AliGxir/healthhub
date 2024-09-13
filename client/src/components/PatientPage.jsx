import { useEffect, useState } from "react";
import { Container, Grid, Card, Button, Header } from "semantic-ui-react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";

const PatientPage = () => {
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [headerTitle, setHeaderTitle] = useState("Upcoming Appointments");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const params = new URLSearchParams(location.search);
    const filter = params.get("filter") || "all";

    switch (filter) {
      case "past":
        setHeaderTitle("Past Appointments");
        break;
      case "future":
        setHeaderTitle("Upcoming Appointments");
        break;
      case "all":
      default:
        setHeaderTitle("All Appointments");
        break;
    }

    fetch(`/api/v1/appointments?filter=${filter}`)
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
  }, [user, navigate, location]);

  const handleUpdateClick = (appointmentId) => {
    navigate(`/appointments/${appointmentId}/edit`);
  };

  const handleDeleteClick = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      fetch(`/api/v1/appointments/${appointmentId}`, {
        method: "DELETE",
      })
        .then((resp) => {
          if (resp.ok) {
            setAppointments((prevAppointments) =>
              prevAppointments.filter(
                (appointment) => appointment.id !== appointmentId
              )
            );
            toast.success("Appointment canceled successfully!");
          } else {
            resp.json().then((errorObj) => toast.error(errorObj.error));
          }
        })
        .catch(() => toast.error("Network error."));
    }
  };

  const firstName = user ? user.first_name : "User";

  return (
    <Container>
      <Header as="h1" textAlign="center" style={{ margin: "20px 0" }}>
        Welcome {firstName} to your Homepage!
      </Header>

      <Header
        as="h2"
        style={{
          fontSize: "1.5em",
          color: "#666",
          textAlign: "left",
          margin: "20px 0",
        }}
      >
        {headerTitle}
      </Header>

      <Grid>
        <Grid.Row>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <Grid.Column key={appointment.id} computer={4}>
                <Card>
                  <Card.Content>
                    <Card.Header>Appointment</Card.Header>
                    <Card.Meta>
                      Date: {new Date(appointment.date).toLocaleDateString()}
                    </Card.Meta>
                    <Card.Description>
                      <p>Reason: {appointment.reason}</p>
                      <p>Status: {appointment.status}</p>
                      <p>
                        Doctor: {appointment.doctor.first_name}{" "}
                        {appointment.doctor.last_name}
                      </p>
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      style={{ backgroundColor: "#F26DAB", color: "#fff" }}
                      onClick={() => handleUpdateClick(appointment.id)}
                    >
                      Update
                    </Button>
                    <Button
                      style={{ backgroundColor: "#528DD9", color: "#fff" }}
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
              <p>No {headerTitle.toLowerCase()} found.</p>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default PatientPage;
