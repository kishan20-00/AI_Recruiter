// src/ApplicationList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Card,
    CardContent,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const ApplicationList = ({ setToken }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/applications');
                setApplications(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching applications');
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handleLogout = () => {
        setToken(null); // Clear the token
        navigate('/'); // Redirect to the login page
    };

    const handleCardClick = (application) => {
        setSelectedApplication(application);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedApplication(null);
    };

    if (loading) return <Container><Typography>Loading applications...</Typography></Container>;
    if (error) return <Container><Typography>{error}</Typography></Container>;

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        RecruitHub
                    </Typography>
                    <Button color="inherit" component={Link} to="/add-job">
                        Add Posting
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" style={{ marginTop: '64px' }}>
                <Typography variant="h4" gutterBottom align="center">
                    Job Applications
                </Typography>
                <Grid container spacing={2}>
                    {applications.map((application) => (
                        <Grid item xs={12} sm={6} md={4} key={application._id}>
                            <Card variant="outlined" onClick={() => handleCardClick(application)} style={{ cursor: 'pointer' }}>
                                <CardContent>
                                    <Typography variant="h6">{application.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Phone:</strong> {application.phone}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Job:</strong> {application.job}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Company:</strong> {application.company}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Match:</strong> {application.match ? 'Matched' : 'Not Matched'}
                                    </Typography>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                        <Typography variant="body2" color="text.secondary" style={{ marginRight: '8px' }}>
                                            <strong>Score:</strong>
                                        </Typography>
                                        <CircularProgress
                                            variant="determinate"
                                            value={application.score * 100} // Convert 0-1 range to 0-100
                                            size={40}
                                            style={{ marginRight: '8px' }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {Math.round(application.score * 100)}%
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Application Details</DialogTitle>
                <DialogContent>
                    {selectedApplication && (
                        <>
                            <Typography variant="h6">{selectedApplication.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Phone:</strong> {selectedApplication.phone}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Job:</strong> {selectedApplication.job}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Company:</strong> {selectedApplication.company}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Experience:</strong> {selectedApplication.experience}
                            </Typography>
                            <br />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Qualifications:</strong> {selectedApplication.qualifications}
                            </Typography>
                            <br />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Skills:</strong> {selectedApplication.skills}
                            </Typography>
                            <br />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Match:</strong> {selectedApplication.match ? 'Matched' : 'Not Matched'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Score:</strong> {selectedApplication.score}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ApplicationList;
