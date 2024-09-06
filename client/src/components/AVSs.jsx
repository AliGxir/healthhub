import { useEffect, useState } from "react";
import { Container, Grid, Card, Header, Button } from "semantic-ui-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AVSs = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
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
      navigate("/patients");
    } else if (user.doctor_id) {
      navigate("/doctors");
    } else {
      navigate("/");
    }
  };

  return (
    <Container>
      <div style={{ marginBottom: "20px" }}>
        <Button color="blue" onClick={handleBackClick}>
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
                      <p>Doctor: {avs.doctor}</p>
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
