import { useState, useEffect } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import UserContext from "./contexts/UserContext";
import { FilterProvider } from "./contexts/FilterContext";
import DocNavBar from "./components/DocNavBar";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/v1/check-session")
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json().then(user => {
            setUser(user);
            navigate(user.patient_id ? "/patient-page" : "/doctor-page")
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
  }, []);

  const updateUser = (value) => {
    setUser(value);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <FilterProvider> 
        <div className="app">
          <Toaster />
          <DocNavBar /> 
          <div className="content">
            <Outlet /> 
          </div>
        </div>
      </FilterProvider>
    </UserContext.Provider>
  );
}

export default App;
