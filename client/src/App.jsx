import { useState } from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <>
      <Toaster />
      <Outlet />
    </>
  )
}

export default App;
