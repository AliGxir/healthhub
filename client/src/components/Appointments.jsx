import { useEffect, useState, useContext } from "react";
import { Container, Grid, Card, Button, Header } from "semantic-ui-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const[filter, setFilter] = useState("all")

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

  return (
    <Container>
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
                        <p>
                          Doctor: {appointment.doctor.first_name}{" "}
                          {appointment.doctor.last_name}
                        </p>
                      ) : user && user.doctor_id ? (
                        <p>
                          Patient: {appointment.patient.first_name}{" "}
                          {appointment.patient.last_name}
                        </p>
                      ) : null}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      style={{ backgroundColor: "#F26DAB", color: "#fff" }}
                      onClick={() =>
                        navigate(`/appointments/${appointment.id}/edit`)
                      }
                    >
                      Update
                    </Button>
                    <Button
                      style={{ backgroundColor: "#528DD9", color: "#fff" }}
                      onClick={() =>
                        navigate(`/appointments/${appointment.id}/delete`)
                      }
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
