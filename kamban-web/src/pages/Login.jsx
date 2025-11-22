import React, { useState } from "react";
import "./login.css";
import logoPNM from "../assets/Logo.PNM.png";

import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // tambahkan ini

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logoPNM} alt="PNM Logo" className="logo" />

        <h2 className="login-title">Login Ke Sistem Kanban ATI</h2>

        <div className="input-wrapper">
          <input type="text" placeholder="Username" />
          <FaUser className="input-icon" />
        </div>

        <div className="input-wrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
          />
          <span 
            className="input-icon clickable" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <button className="btn-login">LOGIN</button>

        {/* Tombol Register menuju register.jsx */}
        <button 
          className="btn-register" 
          onClick={() => navigate("/register")}
        >
          Register
        </button>

        <p className="forget-password">Forget Password?</p>
      </div>
    </div>
  );
}
