import { useState, useEffect } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import UserContext from "./contexts/UserContext";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/v1/check-session")
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json().then(user => {
            setUser(user);
            navigate(user.patient_id ? "/patient" : "/doctor")
          })
        } else {
          return resp.json().then((errorObj) => {
            toast.error(errorObj.error);
          });
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });

    fetch("/api/v1/doctors")
      .then((resp) => {
        if (resp.ok) {
          return resp.json().then((data) => {
            setDoctors(data);
          });
        } else {
          resp.json().then((errorObj) => toast.error(errorObj.error));
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });

    fetch("/api/v1/patients")
      .then((resp) => {
        if (resp.ok) {
          return resp.json().then((data) => {
            setPatients(data);
          });
        } else {
          resp.json().then((errorObj) => toast.error(errorObj.error));
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const updateUser = (value) => {
    setUser(value);
  };

  return (
    <UserContext.Provider value={{ user, doctors, patients, updateUser }}>
      <div className="app">
        <Toaster />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
