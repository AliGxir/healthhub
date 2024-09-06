import { useEffect, useState } from "react";
import { Container, Grid, Card, Button, Menu } from "semantic-ui-react";
import toast from "react-hot-toast";
import { useOutletContext, useNavigate } from "react-router-dom";

const PatientPage = () => {
  const { user, updateUser } = useOutletContext();
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
    fetch("/logout", {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 204) {
        updateUser(null);
        navigate("/"); 
      }
    });
  };

  return (
    <Container>
      <Menu pointing secondary>
        <Menu.Item
          name="Appointments"
          onClick={() => navigate("/appointments")}
        />
        <Menu.Item
          name="Billings"
          onClick={() => navigate("/billings")}
        />
        <Menu.Item
          name="Prescriptions"
          onClick={() => navigate("/prescriptions")}
        />
        <Menu.Item
          name="AVSS"
          onClick={() => navigate("/avss")}
        />
        <Menu.Item
          name="Doctors List"
          onClick={() => navigate("/doctors-list")}
        />
        <Menu.Menu position="right">
          <Menu.Item>
            <Button color="red" onClick={handleLogout}>
              Logout
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Grid>
        <Grid.Row>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <Grid.Column
                key={appointment.id}
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

export default PatientPage;
