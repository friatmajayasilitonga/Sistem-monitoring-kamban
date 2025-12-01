import React, { useState } from "react";
import "./register.css";
import { FaUser, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    const response = await fetch("http://localhost/Sistem-Monitoring-kamban/kamban-web/src/pages/api/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password, confirm })
    });

    const result = await response.json();
    alert(result.message);

    if (result.status) {
      window.location.href = "/login"; // redirect setelah sukses
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">

        <h1 className="company-name">PT. PNM</h1>
        <p className="company-subtitle">PT. Permodalan Nasional Madani</p>
        <h2 className="register-title">Daftar Akun Baru Sistem Kanban ATI</h2>

        <div className="form-grid">

          <div className="left-inputs">
            <div className="input-wrapper">
              <input 
                type="text" 
                placeholder="Nama lengkap" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FaUser className="input-icon right-icon" /> 
            </div>

            <div className="input-wrapper">
              <input 
                type="text" 
                placeholder="Email kantor"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaEnvelope className="input-icon email-icon" />
            </div>
          </div>

          <div className="right-input">
            <div className="input-wrapper">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span 
                className="input-icon clickable right-icon"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <div className="input-wrapper">
              <input
                type={showPass2 ? "text" : "password"}
                placeholder="Ulangi Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <span 
                className="input-icon clickable right-icon"
                onClick={() => setShowPass2(!showPass2)}
              >
                {showPass2 ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

        </div>

        <button className="btn-register-main" onClick={handleRegister}>
          REGISTER
        </button>
      </div>
    </div>
  );
}