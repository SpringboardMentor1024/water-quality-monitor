import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BaseMap from "./pages/BaseMap";
import Search from "./pages/Search";
import Analysis from "./pages/Analysis";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<BaseMap />} />
        <Route path="/search" element={<Search />} />
        <Route path="/analysis" element={<Analysis />} />

      </Routes>
    </BrowserRouter>
  );
}
