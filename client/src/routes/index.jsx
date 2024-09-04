import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Registration from "../components/Registration";
import PatientPage from "../components/PatientPage";
import DoctorsList from "../components/DoctorsList";
import Billings from "../components/Billings";
import AVSs from "../components/AVSs";
import Prescriptions from "../components/Prescriptions";
import Appointments from "../components/Appointments";
import AppointmentForm from "../components/AppointmentForm";
import DoctorPage from "../components/DoctorPage";
import PatientsList from "../components/PatientsList";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Registration />,
      },
      {
        path: "/patients",
        element: <PatientPage />,
      },
      {
        path: "/doctors",
        element: <DoctorsList />,
      },
      {
        path: "/billings",
        element: <Billings />,
      },
      {
        path: "/avss",
        element: <AVSs />,
      },
      {
        path: "/prescriptions",
        element: <Prescriptions />,
      },
      {
        path: "/appointments",
        element: <Appointments />,
      },
      {
        path: "/appointments/form",
        element: <AppointmentForm />,
      },
      {
        path: "/appointments/update",
        element: <UpdateAppointment />,
      },
      {
        path: "doctors/:doctorId",
        element: <DoctorPage />,
      },
      {
        path: "/patients/patientId",
        element: <PatientsList />
      }
    ],
  },
]);
