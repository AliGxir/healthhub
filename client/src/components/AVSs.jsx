import { useEffect, useState } from "react";
import { Container, Grid, Card, Header } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import toast from "react-hot-toast";
import { useContext } from "react";

const AVSs = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [avss, setAvss] = useState([]);

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
          setAvss(data);
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


  return (
    <Container>
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
                      <p>Diagnosis: {avs.diagnosis}</p>
                      <p>Treatment: {avs.treatment}</p>
                      {user.patient_id && (
                          <p>Doctor: {`${avs.appointment?.doctor?.first_name || ""} ${avs.appointment?.doctor?.last_name || "N/A"}`.trim()}</p>
                        )}
                        {user.doctor_id && (
                          <p>Patient: {`${avs.appointment?.patient?.first_name || ""} ${avs.appointment?.patient?.last_name || "N/A"}`.trim()}</p>
                        )}
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
