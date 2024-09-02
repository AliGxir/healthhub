import { useEffect, useState } from "react";
import { Container, Grid } from "semantic-ui-react";
import toast from "react-hot-toast";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

const PatientPage = () => {


    // const upcomingAppointments = appointments.filter((appointment) => {
    //     const appointmentDate = new Date(appointment.date);
    //     const currentDate = new Date();
    //     return appointmentDate > currentDate;
    // });

    // if (upcomingAppointments.length === 0) {
    //     return <h3>No upcoming appointments</h3>;
    // }

    // const { date, reason, status, doctor } = appointments;

    

    return (
        <div className="card" data-testid="appointment-item">
            <p>Date: {appointments.date}</p>
            <p>Reason: {appointments.reason}</p>
            <p>Status: {appointments.status}</p>
            <p>Doctor: {appointments.doctor_id}</p>
        </div>
    );
};

export default PatientPage;




    // return (
    //     <Container>
    //     <NavBar />
    //     <div className="upcoming-appointments">
    //         <h2>Upcoming Appointments</h2>
    //         <Grid>
    //             {upcomingAppointments.map((appointment) => (
    //                 <Grid.Row key={appointment.id}>
    //                     <Grid.Column>
    //                         <div>
    //                             <p>Date: {new Date(date).toLocaleDateString()}</p>
    //                             <p>Reason: {reason}</p>
    //                             <p>Status: {status}</p>
    //                             <p>Doctor: {doctor}</p>
    //                         </div>
    //                     </Grid.Column>
    //                 </Grid.Row>
    //             ))}
    //         </Grid>
    //     </div>
    // </Container>
    // );
