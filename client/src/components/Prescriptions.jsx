import { useEffect, useState, useContext } from "react";
import { Container, Grid, Card, Header } from "semantic-ui-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

const Prescriptions = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchPrescriptions = async () => {
      try {
        const response = await fetch("/api/v1/prescriptions");
        if (response.ok) {
          const data = await response.json();
          setPrescriptions(data);
        } else {
          const errorObj = await response.json();
          toast.error(errorObj.error);
        }
      } catch (error) {
        toast.error("Failed to fetch prescriptions.");
      }
    };

    fetchPrescriptions();
  }, [user, navigate]);

  return (
    <Container>
      <Header as="h2" textAlign="center" style={{ marginBottom: "20px" }}>
        Prescriptions
      </Header>

      <Grid>
        <Grid.Row>
          {prescriptions.length > 0 ? (
            prescriptions.map((prescription) => (
              <Grid.Column key={prescription.id} computer={4}>
                <Card>
                  <Card.Content>
                    <Card.Header>
                      Prescription Name: {prescription.medication_name}
                    </Card.Header>
                    <Card.Description>
                      <p>Dosage: {prescription.dosage}</p>
                      <p>
                        Start Date:{" "}
                        {new Date(prescription.start_date).toLocaleDateString()}
                      </p>
                      <p>
                        End Date:{" "}
                        {new Date(prescription.end_date).toLocaleDateString()}
                      </p>
                      <p>
                        Doctor: {prescription.doctor.first_name}{" "}
                        {prescription.doctor.last_name}
                      </p>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          ) : (
            <Grid.Column>
              <p>No prescriptions found.</p>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Prescriptions;
