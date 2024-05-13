import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { path } from '../../path';

function Profile({ auth, setAuth, users, updateUsers }) {
  const [userDetails, setUserDetails] = useState({
    login_name: '',
    first_name: '',
    last_name: '',
    location: '',
    description: '',
    occupation: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const { pathname } = useLocation();

  const id  = pathname.split("/").pop();

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`${path}api/user/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
      } else {
        setMessage({ type: 'danger', text: 'Error fetching user details' });
      }
    };
    
    if (id) {
      fetchUserData();
    }
  }, [id]);
  console.log(userDetails);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${path}api/user/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userDetails)
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setAuth({ ...auth, user: updatedUser });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      updateUsers();
    } else {
      setMessage({ type: 'danger', text: 'Error updating profile' });
    }
  };

  return (
    <Container>
      <h3>Update Profile</h3>
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="login_name">
          <Form.Label>Login Name</Form.Label>
          <Form.Control type="text" name="login_name" value={userDetails.login_name} disabled />
        </Form.Group>
        <Form.Group controlId="first_name">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" name="first_name" value={userDetails.first_name} onChange={handleChange} placeholder="First Name" />
        </Form.Group>
        <Form.Group controlId="last_name">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" name="last_name" value={userDetails.last_name} onChange={handleChange} placeholder="Last Name" />
        </Form.Group>
        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" name="location" value={userDetails.location} onChange={handleChange} placeholder="Location" />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" name="description" value={userDetails.description} onChange={handleChange} placeholder="Description" />
        </Form.Group>
        <Form.Group controlId="occupation">
          <Form.Label>Occupation</Form.Label>
          <Form.Control type="text" name="occupation" value={userDetails.occupation} onChange={handleChange} placeholder="Occupation" />
        </Form.Group>
        <Button variant="primary" type="submit">Update Profile</Button>
      </Form>
    </Container>
  );
}

export default Profile;
