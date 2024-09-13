import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { FilterProvider } from "./contexts/FilterContext";
import DocNavBar from "./components/DocNavBar";
import PatNavBar from "./components/PatNavBar";
import { TailSpin } from 'react-loader-spinner';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    fetch("/api/v1/check-session")
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json().then((user) => {
            setUser(user);
            navigate(user.patient_id ? "/patient-page" : "/doctor-page");
          });
        } else {
          return resp.json().then((errorObj) => {
            toast.error(errorObj.error);
          });
        }
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, [navigate]);

  const updateUser = (value) => {
    setUser(value);
  };

  const showNavBar = !(location.pathname === "/" || location.pathname === "/registration");

  if (loading) {
    return (
      <div className="loading-container">
        <TailSpin
          height="100"
          width="100"
          color="#3079D9"
          ariaLabel="loading"
        />
      </div>
    );
  }

  return (
    <UserProvider value={{ user, updateUser }}>
      <FilterProvider>
        <div className="app">
          <Toaster />
          {showNavBar && (user?.patient_id ? <PatNavBar /> : user?.doctor_id ? <DocNavBar /> : null)}
          <div className="content">
            <Outlet />
          </div>
        </div>
      </FilterProvider>
    </UserProvider>
  );
};

export default App;
