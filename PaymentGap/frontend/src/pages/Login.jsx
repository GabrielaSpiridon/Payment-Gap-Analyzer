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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });
      if (response.data.success) {
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

  const handleResetPassword = async () => {
    if (!resetUsername || !newPassword) {
      alert("Please enter both username and new password");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/reset-password", {
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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light px-3">
      <div className="w-100" style={{ maxWidth: "420px" }}>
        <div className="card shadow-lg p-4 border-0 rounded-4">
          <h3 className="text-center mb-4 fw-bold text-primary">Welcome Back</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control rounded-3"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control rounded-3"
                required
              />
            </div>
            <button className="btn btn-primary w-100 rounded-3 mb-2" type="submit">
              Login
            </button>
            <button className="btn btn-outline-secondary w-100 rounded-3 mb-2" type="button" onClick={() => navigate("/register")}>
              Register
            </button>
            <button className="btn btn-link w-100 text-center text-decoration-none mt-1" type="button" onClick={() => setShowModal(true)}>
              Forgot Password?
            </button>
          </form>
        </div>
      </div>

      {/* Modal pentru resetarea parolei */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Your Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={resetUsername}
              onChange={(e) => setResetUsername(e.target.value)}
              className="form-control rounded-3"
              required
            />
          </div>
          <div>
            <label className="form-label">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control rounded-3"
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleResetPassword}>
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Login;
