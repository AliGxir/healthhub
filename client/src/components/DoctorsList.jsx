import { useEffect, useState } from "react";
import { Container, Grid, Card, Header, Button } from "semantic-ui-react";
import { useNavigate, useOutletContext } from "react-router-dom";

const DoctorsList = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext(); 
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
      <div style={{ marginBottom: "20px" }}>
        <Button color="blue" onClick={() => navigate("/patients")}>
          Back to Homepage
        </Button>
      </div>
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
                    <Card.Header>Dr. {doctor.first_name} {doctor.last_name}</Card.Header>
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
