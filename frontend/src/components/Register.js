// src/components/Register.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert('Registration successful!');
            navigate('/'); // Optionally redirect to the login page after successful registration
        } catch (error) {
            alert('Error registering user');
        }
    };

    return (
        <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 3, borderRadius: 2, boxShadow: 3 }}
            >
                <Typography variant="h4" gutterBottom align="center">Register</Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
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
                    Register
                </Button>
                <Typography variant="body2" style={{ marginTop: 16, textAlign: 'center' }}>
                    Already have an account? <span onClick={() => navigate('/')} style={{ color: 'blue', cursor: 'pointer' }}>Login</span>
                </Typography>
            </Box>
        </Container>
    );
};

export default Register;
