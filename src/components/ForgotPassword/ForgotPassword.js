// src/components/ForgotPassword.js
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { path } from '../../path';
import './../../App.css'; // Import CSS

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${path}admin/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Mật khẩu mới đã được gửi đến email của bạn. Vui lòng kiểm tra email.");
            navigate('/login'); // Điều hướng người dùng trở lại trang đăng nhập
        } else {
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
            console.error("Forgot password error:", data.error);
        }
    };

    return (
        <Container className="container">
            <h3>Quên Mật Khẩu</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email" className="form-group">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Nhập email của bạn" value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit" className="primary">Gửi</Button>
            </Form>
        </Container>
    );
}

export default ForgotPassword;
