import { useEffect, useState, useContext } from "react";
import { Container, Grid, Card, Button, Header } from "semantic-ui-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import FilterContext from "../contexts/FilterContext";

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { filter } = useContext(FilterContext);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchAppointments = () => {
      fetch(`/api/v1/appointments?filter=${filter}`)
        .then((resp) => {
          if (resp.ok) {
            return resp.json().then((data) => setAppointments(data));
          } else {
            resp.json().then((errorObj) => toast.error(errorObj.error));
          }
        })
        .catch((errorObj) => toast.error(errorObj.message));
    };

    fetchAppointments();
  }, [user, filter, navigate]);

  const getHeader = () => {
    switch (filter) {
      case "past":
        return "Past Appointments";
      case "future":
        return "Future Appointments";
      default:
        return "All Appointments";
    }
  };

  return (
    <Container>
      {user && user.patient_id && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <Button
            style={{ backgroundColor: "#F26DAB", color: "#fff" }}
            onClick={() => navigate("/appointments/new")}
          >
            Schedule an Appointment
          </Button>
        </div>
      )}

      <Header as="h2" textAlign="center" style={{ marginBottom: "20px" }}>
        {getHeader()}
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
                      {user && user.patient_id ? (
                        <p>Doctor: {appointment.doctor.first_name} {appointment.doctor.last_name}</p>
                      ) : user && user.doctor_id ? (
                        <p>Patient: {appointment.patient.first_name} {appointment.patient.last_name}</p>
                      ) : null}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      style={{ backgroundColor: "#F26DAB", color: "#fff" }}
                      onClick={() => navigate(`/appointments/update/${appointment.id}`)}
                    >
                      Update
                    </Button>
                    <Button
                      style={{ backgroundColor: "#528DD9", color: "#fff" }}
                      onClick={() => navigate(`/appointments/delete/${appointment.id}`)}
                    >
                      Delete
                    </Button>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          ) : (
            <Grid.Column>
              <p>No {filter} appointments found.</p>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Appointments;
