import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    AppBar,
    Toolbar,
} from '@mui/material';

const JobPostList = ({ setToken }) => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/jobPosts');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleLogout = () => {
        setToken(null); // Clear the token
        navigate('/'); // Redirect to the login page
    };

    // Function to truncate the description
    const truncateDescription = (description, limit = 100) => {
        return description.length > limit ? `${description.substring(0, limit)}...` : description;
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        RecruitHub
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" style={{ marginTop: '64px' }}>
                <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '24px' }}>
                    Job Vacancies
                </Typography>
                {jobs.length === 0 ? (
                    <Typography variant="h6" align="center" style={{ marginBottom: '24px' }}>
                        No job vacancies available.
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {jobs.map((job) => (
                            <Grid item xs={12} sm={6} md={4} key={job._id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            <Link to={`/job/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {job.jobTitle}
                                            </Link>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {truncateDescription(job.description, 100)} {/* Truncate description */}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.primary">
                                            <strong>Company:</strong> {job.companyName}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary">
                                            <Link to={`/job/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                View Details
                                            </Link>
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </div>
    );
};

export default JobPostList;
