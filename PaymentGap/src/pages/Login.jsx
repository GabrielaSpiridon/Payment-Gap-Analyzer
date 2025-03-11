import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });
      if (response.data.success) {
        alert("Login successful");
        localStorage.setItem("userId", response.data.userId);
        onLoginSuccess();
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
  
    if (!resetUsername || !newPassword) {
      alert("Please enter both username and new password");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/auth/reset-password', {
        username: resetUsername,
        newPassword: newPassword,
      });

      if (response.data.success) {
        alert("Password reset successful!");
        setShowModal(false);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("Failed to reset password");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required />
          </div>
          <div className="mb-3">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
          </div>
          <button className="btn btn-primary w-100 mb-2" type="submit">Login</button>
          <button className="btn btn-secondary w-100" type="button" onClick={() => navigate("/register")}>Register</button>
          <button className="btn btn-link w-100 mt-2" type="button" onClick={() => setShowModal(true)}>Forgot Password?</button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" placeholder="Username" value={resetUsername} onChange={(e) => setResetUsername(e.target.value)} className="form-control mb-2" required />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" required />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleResetPassword}>Reset</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Login;
