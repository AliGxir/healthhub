import { useEffect, useState } from "react";
import { Container, Grid, Card, Button } from "semantic-ui-react";
import toast from "react-hot-toast";
import { useNavigate, useOutletContext } from "react-router-dom";

const DoctorPage = () => {
  const { user } = useOutletContext();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }    
    return (
        <></>
    )
  }
};
    
    export default DoctorPage;