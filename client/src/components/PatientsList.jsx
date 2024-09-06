import { useEffect, useState } from "react";
import { Container, Grid, Card, Header, Button } from "semantic-ui-react";
import { useNavigate, useOutletContext } from "react-router-dom";

const PatientsList = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext(); 
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/"); 
      return;
    }

    const fetchPatients = () => {
      fetch(`/api/v1/patients?doctor_id=${user.id}`) 
        .then((resp) => {
          if (resp.ok) {
            return resp.json().then((data) => setPatients(data));
          } else {
            resp.json().then((errorObj) => console.error(errorObj.error));
          }
        })
        .catch((error) => console.error("Failed to fetch patients", error));
    };

    fetchPatients();
  }, [user, navigate]);

  return (
    <Container>
      <div style={{ marginBottom: "20px" }}>
        <Button color="blue" onClick={() => navigate("/doctors")}>
          Back to Homepage
        </Button>
      </div>
      <Header as="h2" textAlign="center" style={{ marginBottom: "20px" }}>
        Your Patients
      </Header>

      <Grid>
        <Grid.Row>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <Grid.Column key={patient.id} computer={4}>
                <Card>
                  <Card.Content>
                    <Card.Header>Patient: {patient.first_name} {patient.last_name}</Card.Header>
                    <Card.Description>
                      <p>DOB: {patient.date_of_birth}</p>
                      <p>Gender: {patient.gender}</p>
                      <p>Address: {patient.phone_number}</p>
                      <p>Phone Number: {patient.phone_number}</p>
                      <p>Email: {patient.email}</p>
                      <p>Insurance ID: {patient.insurance_id}</p>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          ) : (
            <Grid.Column>
              <p>No patients found for this doctor.</p>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default PatientsList;
