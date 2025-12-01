import React, { useState } from "react";
import "./login.css";
import logoPNM from "../assets/Logo.PNM.png";

import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      alert("Email dan Password wajib diisi");
      return;
    }

    try {
      const response = await fetch("http://localhost/Kamban/kamban-web/src/pages/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.status === true) {
        // SIMPAN ROLE + DATA KE LOCAL STORAGE
        localStorage.setItem("name", result.name);
        localStorage.setItem("email", result.email);
        localStorage.setItem("role", result.role);  // ⬅ WAJIB

        alert("Login berhasil!");
        navigate("/dashboard");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Gagal terhubung ke server!");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logoPNM} alt="PNM Logo" className="logo" />

        <h2 className="login-title">Login Ke Sistem Kanban ATI</h2>

        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Email Kantor"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="input-icon" />
        </div>

        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="input-icon clickable"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <button className="btn-login" onClick={handleLogin}>LOGIN</button>
        <button className="btn-register" onClick={() => navigate("/register")}>Register</button>

        <p className="forget-password">Forget Password?</p>
      </div>
    </div>
  );
}
