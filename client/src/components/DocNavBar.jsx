import { Menu, Dropdown, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import FilterContext from "../contexts/FilterContext"; 

const DocNavBar = ({ onFilterChange }) => {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const { setFilter } = useContext(FilterContext); 

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
    <Menu.Item name="Home" onClick={() => navigate("/doctor-page")} />
    <Dropdown item text="Appointments">
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => setFilter('all')}>All Appointments</Dropdown.Item>
        <Dropdown.Item onClick={() => setFilter('past')}>Past Appointments</Dropdown.Item>
        <Dropdown.Item onClick={() => setFilter('future')}>Future Appointments</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Menu.Item name="AVS" onClick={() => navigate("/avss")} />
    <Menu.Item name="Prescriptions" onClick={() => navigate("/prescriptions")} />
    <Menu.Item name="Patient List" onClick={() => navigate("/patients-list")} />
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

export default DocNavBar;