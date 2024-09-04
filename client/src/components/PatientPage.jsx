import { useEffect, useState } from "react";
import { Container, Grid, Card, Button, Label } from "semantic-ui-react";
import toast from "react-hot-toast";
import { useOutletContext, useNavigate } from "react-router-dom";
import * as yup from "yup";

const PatientPage = () => {
  const { user } = useOutletContext();
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
            const now = new Date();
            const userAppointments = data
              .filter((appointment) => appointment.patient_id === user.id)
              .filter((appointment) => new Date(appointment.date) >= now);
            setAppointments(userAppointments);
          });
        } else {
          resp.json().then((errorObj) => toast.error(errorObj.error));
        }
      })
      .catch((errorObj) => toast.error(errorObj.message));
  }, [user, navigate]);

  return (
    <Container>
      <Grid>
        <Grid.Row>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <Grid.Column
                key={appointment.id}
                mobile={16}
                tablet={8}
                computer={4}
              >
                <Card>
                  <Card.Content>
                    <Card.Header>Appointment ID: {appointment.id}</Card.Header>
                    <Card.Meta>
                      Date: {new Date(appointment.date).toLocaleDateString()}
                    </Card.Meta>
                    <Card.Description>
                      <p>Reason: {appointment.reason}</p>
                      <p>Status: {appointment.status}</p>
                      <p>Doctor: {appointment.doctor_id}</p>
                    </Card.Description>
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

export default PatientPage;
