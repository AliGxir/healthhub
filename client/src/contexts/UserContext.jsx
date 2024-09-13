import { createContext } from "react";
import { useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const updateUser = (value) => {
        setUser(value);
      };
    
    return (
        <UserContext.Provider value={{ user, setUser, updateUser }}>
        {children}
        </UserContext.Provider>
    )
}
export default UserContext;