import { useState, useEffect } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
// import NavBar from "../components/NavBar";

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
    <div className="app">
      <Toaster />
      {/* <header>
      <NavBar user={ user } updateUser={ updateUser } />
      </header> */}
      <div className="content">
        <Outlet  context={{ user, updateUser }} />
      </div>
    </div>
  )
}

export default App;
