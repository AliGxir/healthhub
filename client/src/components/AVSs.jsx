import { useEffect, useState } from "react";
import { Container, Grid, Card, Header, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import toast from "react-hot-toast";
import { useContext } from "react";

const AVSs = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [avss, setavss] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchavss = async () => {
      try {
        const response = await fetch("/api/v1/avss");
        if (response.ok) {
          const data = await response.json();
          setavss(data);
        } else {
          const errorObj = await response.json();
          toast.error(errorObj.error);
        }
      } catch (error) {
        toast.error("Failed to fetch avss.");
      }
    };

    fetchavss();
  }, [user, navigate]);

  const handleBackClick = () => {
    if (user.patient_id) {
      navigate("/patient-page");
    } else if (user.doctor_id) {
      navigate("/doctor-page");
    } else {
      navigate("/");
    }
  };

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "20px" }}>
        <Button style={{ backgroundColor: "#F26DAB", color: "#fff" }} onClick={handleBackClick}>
          Back to Homepage
        </Button>
      </div>
      
      <Header as="h2" textAlign="center" style={{ marginBottom: "20px" }}>
        After Visit Summaries
      </Header>


      <Grid>
        <Grid.Row>
          {avss.length > 0 ? (
            avss.map((avs) => (
              <Grid.Column key={avs.id} computer={4}>
                <Card>
                  <Card.Content>
                    <Card.Header>AVS</Card.Header>
                    <Card.Meta>
                      Record Date: {new Date(avs.record_date).toLocaleDateString()}
                    </Card.Meta>
                    <Card.Description>
                      <p>Notes: {avs.notes}</p>
                      <p>Diagnosis: {avs.payment_diagnosis}</p>
                      <p>Treatment: {avs.treatment}</p>
                      <p>Doctor: </p>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          ) : (
            <Grid.Column>
              <p>No avss found for this appointment.</p>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default AVSs;
