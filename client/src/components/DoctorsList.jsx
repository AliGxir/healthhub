import { useEffect, useState, useContext } from "react";
import { Container, Grid, Card, Header } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

const DoctorsList = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchDoctors = () => {
      fetch("/api/v1/doctors")
        .then((resp) => {
          if (resp.ok) {
            return resp.json().then((data) => setDoctors(data));
          } else {
            resp.json().then((errorObj) => console.error(errorObj.error));
          }
        })
        .catch((error) => console.error("Failed to fetch doctors:", error));
    };

    fetchDoctors();
  }, [user, navigate]);

  return (
    <Container>
      <Header as="h2" textAlign="center" style={{ marginBottom: "20px" }}>
        Your Doctors
      </Header>

      <Grid>
        <Grid.Row>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <Grid.Column key={doctor.id} computer={4}>
                <Card>
                  <Card.Content>
                    <Card.Header>
                      Dr. {doctor.first_name} {doctor.last_name}
                    </Card.Header>
                    <Card.Meta>Specialty: {doctor.specialty}</Card.Meta>
                    <Card.Description>
                      <p>Email: {doctor.email}</p>
                      <p>Phone: {doctor.phone_number}</p>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          ) : (
            <Grid.Column>
              <p>No doctors found for this patient.</p>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default DoctorsList;
