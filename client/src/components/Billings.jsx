import { useEffect, useState, useContext } from "react";
import { Container, Grid, Card, Header, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserContext from "../contexts/UserContext";

const Billings = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchBills = async () => {
      try {
        const response = await fetch("api/v1/billings");
        if (response.ok) {
          const data = await response.json();
          setBills(data);
        } else {
          const errorObj = await response.json();
          toast.error(errorObj.error);
        }
      } catch (error) {
        toast.error("Failed to fetch bills.");
      }
    };

    fetchBills();
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
        Billing Information
      </Header>

      <Grid>
        <Grid.Row>
          {bills.length > 0 ? (
            bills.map((bill) => (
              <Grid.Column key={bill.id} computer={4}>
                <Card>
                  <Card.Content>
                    <Card.Header>Billing</Card.Header>
                    <Card.Meta>
                      Billing Date: {new Date(bill.billing_date).toLocaleDateString()}
                    </Card.Meta>
                    <Card.Description>
                      <p>Amount Due: ${bill.amount_due.toFixed(2)}</p>
                      <p>Payment Status: {bill.payment_status}</p>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          ) : (
            <Grid.Column>
              <p>No bills found for this appointment.</p>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Billings;
