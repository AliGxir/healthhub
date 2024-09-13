import { Button, Menu, Dropdown } from "semantic-ui-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";

const PatNavBar = () => {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (location.pathname === "/") {
    return null;
  }

  const handleLogout = () => {
    fetch("/api/v1/logout", {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 204) {
        updateUser(null);
        navigate("/");
      }
    });
  };

  const handleFilterClick = (filter) => {
    navigate(`/patient-page?filter=${filter}`);
  };

  return (
    <Menu pointing secondary>
      {user && user.patient_id ? (
        <Menu.Item name="Home" onClick={() => navigate("/patient-page")} />
      ) : user && user.doctor_id ? (
        <Menu.Item name="Home" onClick={() => navigate("/doctor-page")} />
      ) : null}

      <Dropdown item text="Appointments">
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleFilterClick("all")}>
            All Appointments
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilterClick("past")}>
            Past Appointments
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilterClick("future")}>
            Future Appointments
          </Dropdown.Item>

          {user && user.patient_id && (
            <Dropdown.Item onClick={() => navigate("/appointments/new")}>
              Schedule an Appointment
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {user && user.patient_id && (
        <Menu.Item name="Billings" onClick={() => navigate("/billings")} />
      )}

      <Menu.Item
        name="Prescriptions"
        onClick={() => navigate("/prescriptions")}
      />

      <Menu.Item name="AVSS" onClick={() => navigate("/avss")} />

      {user && user.patient_id && (
        <Menu.Item
          name="Doctors List"
          onClick={() => navigate("/doctors-list")}
        />
      )}

      {user && user.doctor_id && (
        <Menu.Item
          name="Patient List"
          onClick={() => navigate("/patients-list")}
        />
      )}

      <Menu.Menu position="right">
        <Menu.Item>
          <Button
            style={{ backgroundColor: "#3079D9", color: "#fff" }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default PatNavBar;
