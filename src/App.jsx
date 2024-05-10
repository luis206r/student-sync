import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";
import { Home } from "./Components/Home";
import { Layout } from "./Components/Layout";

function App() {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<p>futuro landing page</p>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="home" element={<Layout option={"home"} />} />
        <Route path="red" element={<Layout option={"red"} />} />
        <Route path="explore" element={<Layout option={"explore"} />} />
        <Route path="more" element={<Layout option={"more"} />} />
      </Routes>
    </div>
  );
}

export default App;
