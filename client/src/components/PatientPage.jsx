import { useEffect, useState } from "react";
import { Container, Grid } from "semantic-ui-react";
import toast from "react-hot-toast";
import NavBar from "./NavBar";

const PatientPage = () => {
    const { user } = useOutletContext();
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        if (user) {
            fetch(`/patients/${id}`)
                .then((resp => {
                    if (resp.ok) {
                        return resp.json().then((data) => {
                            setAppointment(data);
                        });
                    } else {
                        return resp.json().then(() => {
                            resp.json().then((errorObj) => toast.error(errorObj.error));
                        });
                    }
                }))
                .catch((errorObj) => toast.error(errorObj.error));
        }
    }, [patientId, user]);

    if (!appointment) {
        return <h3>No upcoming appointments</h3>;
    }

    return 
    <div className="upcoming-appointments">Upcoming Appointments</div>
}

export default PatientPage;