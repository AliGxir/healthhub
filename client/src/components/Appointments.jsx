import { useEffect, useState, useContext } from "react";
import { Container, Grid, Card, Button, Menu, Header } from "semantic-ui-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

const Appointments = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");

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

  const handleUpdate = (appointmentId) => {
    navigate(`/appointments/update/${appointmentId}`);
  };

  const handleDelete = (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      fetch(`/api/v1/appointments/${appointmentId}`, {
        method: "DELETE",
      })
        .then((resp) => {
          if (resp.ok) {
            setAppointments((prev) =>
              prev.filter((appointment) => appointment.id !== appointmentId)
            );
            toast.success("Appointment deleted successfully.");
          } else {
            resp.json().then((errorObj) => toast.error(errorObj.error));
          }
        })
        .catch((errorObj) => toast.error(errorObj.message));
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
        <Menu.Item name="Appointments" onClick={() => navigate("/appointments")} />
        {user.patient_id && (
          <Menu.Item
            name="Schedule Appointment"
            onClick={() => navigate("/appointments/new")}
          />
        )}
        <Menu.Item name="Past Appointments" onClick={() => setFilter("past")} />
        <Menu.Item name="Future Appointments" onClick={() => setFilter("future")} />
        <Menu.Menu position="right">
          <Menu.Item>
            <Button style={{ backgroundColor: "#3079D9", color: "#fff" }} onClick={handleLogout}>
              Logout
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Button style={{ backgroundColor: "#F26DAB", color: "#fff" }} onClick={handleBackClick}>
          Back to Homepage
        </Button>
        {user.patient_id && (
          <Button style={{ backgroundColor: "#F26DAB", color: "#fff" }} onClick={() => navigate("/appointments/new")}>
            Schedule an Appointment
          </Button>
        )}
      </div>

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
                      <p>Doctor: {appointment.doctor_id}</p>
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      style={{ backgroundColor: "#F26DAB", color: "#fff" }}
                      onClick={() => handleUpdate(appointment.id)}
                    >
                      Update
                    </Button>
                    <Button
                      style={{ backgroundColor: "#528DD9", color: "#fff" }}
                      onClick={() => handleDelete(appointment.id)}
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
