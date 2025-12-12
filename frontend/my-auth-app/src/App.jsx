import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const [screen, setScreen] = useState("login");

  return screen === "login" ? (
    <Login onSwitch={() => setScreen("register")} />
  ) : (
    <Register onSwitch={() => setScreen("login")} />
  );
}
