import React, { useState } from "react";
import "./register.css";

import { FaUser, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  return (
    <div className="register-container">
      <div className="register-box">
        
        {/* HEADER / TITLE */}
        <h1 className="company-name">PT. PNM</h1>
        <p className="company-subtitle">PT. Permodalan Nasional Madani</p>

        <h2 className="register-title">Daftar Akun Baru Sistem Kanban ATI</h2>

        {/* FORM GRID */}
        <div className="form-grid">

          {/* Kolom KIRI (4 Input Vertikal) */}
          <div className="left-inputs">
            {/* Nama lengkap (Ikon di kanan) */}
            <div className="input-wrapper">
              <input type="text" placeholder="Nama lengkap" />
              <FaUser className="input-icon right-icon" /> 
            </div>

            {/* Username (Ikon di kanan) */}
            <div className="input-wrapper">
              <input type="text" placeholder="Username" />
              <FaUser className="input-icon right-icon" /> 
            </div>

            {/* Password (Ikon di kanan, clickable) */}
            <div className="input-wrapper">
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="Password" 
              />
              <span 
                className="input-icon clickable right-icon" 
                onClick={() => setShowPass(!showPass)}
              >
                {/* Pastikan ikon ini ter-render dengan benar */}
                {showPass ? <FaEye /> : <FaEyeSlash />} 
              </span>
            </div>

            {/* Ulangi Password (Ikon di kanan, clickable) */}
            <div className="input-wrapper">
              <input 
                type={showPass2 ? "text" : "password"} 
                placeholder="Ulangi Password" 
              />
              <span 
                className="input-icon clickable right-icon" 
                onClick={() => setShowPass2(!showPass2)}
              >
                {showPass2 ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          {/* Kolom KANAN (1 Input Email Kantor) */}
          <div className="right-input">
            <div className="email-box-wrapper">
              <input 
                type="email" 
                placeholder="Email Kantor" 
                className="email-input-placeholder"
              />
              <FaEnvelope className="input-icon email-icon" /> 
            </div>
          </div>

        </div>

        {/* BUTTON REGISTER */}
        <button className="btn-register-main">REGISTER</button>
      </div>
    </div>
  );
}