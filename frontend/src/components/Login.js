// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setToken }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const ADMIN_EMAIL = 'admin123@gmail.com';
    const ADMIN_PASSWORD = '12345678';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            const { token } = response.data;
            setToken(token);

            if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
                navigate('/applications');
            } else {
                alert('Login successful!');
                navigate('/');
            }
        } catch (error) {
            alert('Invalid credentials');
        }
    };

    return (
        <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 3, borderRadius: 2, boxShadow: 3 }}
            >
                <Typography variant="h4" gutterBottom align="center">Login</Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
                <Typography variant="body2" style={{ marginTop: 16, textAlign: 'center' }}>
                    Don't have an account? <span onClick={() => navigate('/register')} style={{ color: 'blue', cursor: 'pointer' }}>Register</span>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
