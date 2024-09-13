import { Button, Menu, Dropdown } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import FilterContext from "../contexts/FilterContext"; 

const PatNavBar = () => {
  const { updateUser } = useContext(UserContext);
  const { filter, setFilter } = useContext(FilterContext); 
  const navigate = useNavigate();

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

  const appointmentOptions = [
    { key: 'all', text: 'All Appointments', value: 'all' },
    { key: 'past', text: 'Past Appointments', value: 'past' },
    { key: 'future', text: 'Future Appointments', value: 'future' },
  ];

  return (
    <Menu pointing secondary>
      <Menu.Item name="Home" onClick={() => navigate("/patient-page")} />
      <Dropdown item text="Appointments">
        <Dropdown.Menu>
        <Dropdown.Item onClick={() => setFilter('all')}>All Appointments</Dropdown.Item>
        <Dropdown.Item onClick={() => setFilter('past')}>Past Appointments</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter('future')}>Future Appointments</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/appointments/new")}>Schedule an Appointment</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Menu.Item name="Billings" onClick={() => navigate("/billings")} />
      <Menu.Item name="Prescriptions" onClick={() => navigate("/prescriptions")} />
      <Menu.Item name="AVSS" onClick={() => navigate("/avss")} />
      <Menu.Item name="Doctors List" onClick={() => navigate("/doctors-list")} />
      <Menu.Menu position="right">
        <Menu.Item>
          <Button style={{ backgroundColor: "#3079D9", color: "#fff" }} onClick={handleLogout}>
            Logout
          </Button>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default PatNavBar;
