import { createBrowserRouter } from "react-router-dom";
import App from "../App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Patients />,
      },
      {
        path: "/patients/:patientId",
        element: <PatientDetails />,
      },
      {
        path: "/doctors",
        element: <Doctors />,
      },
      {
        path: "doctors/:doctorId",
        element: <DoctorDetails />,
      },
      {
        path: "/appointments",
        element: <Appointments />,
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
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
