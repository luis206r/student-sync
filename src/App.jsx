import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";
import { Home } from "./Components/Home";

function App() {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<p>futuro landing page</p>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
