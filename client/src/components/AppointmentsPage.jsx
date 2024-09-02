import { useEffect, useState } from "react";
import { Container, Grid } from "semantic-ui-react";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";

const AppointmentsPage = () => {
    // const { user } = useOutletContext();
    // const [appointments, setAppointments] = useState([]);
    // const { id } = useParams();

    // useEffect(() => {
    //     fetch(`http://localhost:5555/api/v1/appointments`)
    //         .then((resp) => {
    //             if (resp.ok) {
    //                 return resp.json().then((data) => {
    //                     console.log(data); 
    //                     setAppointments(data);
    //                 });
    //             } else {
    //                     resp.json().then((errorObj) => toast.error(errorObj.error));
    //                 }
    //             })
    //         .catch((errorObj) => toast.error(errorObj.error));
    // }, []);
    return <></>
}

export default AppointmentsPage;