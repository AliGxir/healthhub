import { useEffect, useState } from "react";
import { Container, Grid, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <div style={{ marginBottom: "20px" }}>
        <Button color="blue" onClick={() => navigate("/appointments/new")}>
          Schedule an Appointment
        </Button>
        <Button color="purple" onClick={() => navigate("/appointments/update")}>
          Update an Appointment</Button>
        <Button color="red" onClick={() => navigate("/past-appointments")}>
          Past Appointments
        </Button>
        <Button color="green" onClick={() => navigate("/future-appointments")}>
          Future Appointments
        </Button>
      </div>

      {/* Main Appointments Content (can be expanded as needed) */}
      <Grid>
        {/* Additional content can be rendered here */}
      </Grid>
    </Container>
  );
};

export default Appointments;
