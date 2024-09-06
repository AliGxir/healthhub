import { useState, useEffect } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import UserContext from "./contexts/UserContext"; 

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check-session")
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json().then(setUser);
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
