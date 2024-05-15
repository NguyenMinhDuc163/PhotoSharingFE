// src/components/Login.js
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, githubProvider } from '../../auth/firebaseConfig';
import { signInWithPopup } from "firebase/auth";
import { path } from '../../path';
import './../../App.css'; // Import CSS
import googleLogo from './../../images/g-logo.png'; // Import Google logo
import githubLogo from './../../images/github-logo.png'; // Import GitHub logo

function Login({ setAuth }) {
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${path}admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_name: loginName, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth({ loggedIn: true, user: data.user });
      navigate(`/users/${data.user._id}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuth({ loggedIn: true, user });
      navigate(`/users/${user.uid}`);
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuth({ loggedIn: true, user });
      navigate(`/users/${user.uid}`);
    } catch (error) {
      console.error("Error logging in with GitHub", error);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleForgotPasswordRedirect = () => {
    navigate('/forgot-password');
  };

  return (
      <Container className="container">
        <h3>Login</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="loginName" className="form-group">
            <Form.Label>Login Name</Form.Label>
            <Form.Control type="text" placeholder="Enter login name" value={loginName} onChange={e => setLoginName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="password" className="form-group">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit" className="primary">Login</Button>
        </Form>
        <div className="button-group">
          <div className="social-btn google-btn" onClick={handleGoogleLogin}>
            <img src={googleLogo} alt="Google logo" />
            <span>Login with Google</span>
          </div>
          <div className="social-btn github-btn" onClick={handleGithubLogin}>
            <img src={githubLogo} alt="GitHub logo" />
            <span>Login with GitHub</span>
          </div>
        </div>
        <div className="action-buttons">
          <Button variant="secondary" onClick={handleRegisterRedirect} className="secondary">Register</Button>
          <Button variant="secondary" onClick={handleForgotPasswordRedirect} className="secondary">Forgot Password</Button>
        </div>
      </Container>
  );
}

export default Login;
