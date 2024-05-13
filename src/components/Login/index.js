// Login.js
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { path } from '../../path';

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
      // add name to alert
      alert(`Login successful ${data.user.first_name}!`)
      navigate('/');
    } else {
      alert(data.error);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); 
  };

  return (
    <Container>
      <h3>Login</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="loginName">
          <Form.Label>Login Name</Form.Label>
          <Form.Control type="text" placeholder="Enter login name" value={loginName} onChange={e => setLoginName(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">Login</Button>
      </Form>
      <div className="mt-3">
        <Button variant="secondary" onClick={handleRegisterRedirect}>
          Register
        </Button>
      </div>
    </Container>
  );
}

export default Login;
