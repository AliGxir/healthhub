import { useEffect, useState } from "react";
import { Container, Grid, Card, Header } from "semantic-ui-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

const Billings = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext(); 
  const [bills, setBills] = useState([]);

    useEffect(() => {
        if (!user) {
          navigate("/");
          return;
        }

    

    const fetchBills = async () => {
      try {
        const resp = await fetch("/api/v1/billings");
        if (resp.ok) {
          const data = await resp.json();
          const patientBills = data.filter((bill) => bill.patient_id === user.id);
          setBills(patientBills);
        } else {
          const errorObj = await resp.json();
          toast.error(errorObj.error);
        }
      } catch (error) {
        toast.error("Failed to fetch bills.");
      }
    };

    fetchBills();
  }, [user, navigate]);
    return <></>
}

export default Billings;