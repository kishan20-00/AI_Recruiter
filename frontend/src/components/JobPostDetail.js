// src/JobPostDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    Snackbar,
    Alert,
} from '@mui/material';

const JobPostDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [cvFile, setCvFile] = useState(null);
    const [applicantName, setApplicantName] = useState('');
    const [applicantPhone, setApplicantPhone] = useState('');
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/jobPosts/${id}`);
            setJob(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const handleCvUpload = (e) => {
        setCvFile(e.target.files[0]);
    };

    const handleApply = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('pdf_file', cvFile);

        try {
            const uploadResponse = await axios.post('http://localhost:5001/upload_resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { experience, qualifications, skills } = uploadResponse.data;

            const matchFormData = new FormData();
            matchFormData.append('pdf_file', cvFile);
            matchFormData.append('job_category', job.jobCategory);
            matchFormData.append('job_description', job.description);

            const matchResponse = await axios.post('http://localhost:5002/check_cv', matchFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { category_match, similarity_score } = matchResponse.data;

            const applicationData = {
                name: applicantName,
                phone: applicantPhone,
                experience,
                qualifications,
                job: job.jobTitle,
                company: job.companyName,
                skills,
                match: category_match,
                score: similarity_score,
            };

            await axios.post('http://localhost:5000/api/applications', applicationData);
            setMessage('Application submitted successfully!');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            setMessage('Failed to submit application.');
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    if (!job) return <Typography variant="h6">Loading job details...</Typography>;

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h4">{job.jobTitle}</Typography>
                    <Typography variant="body1" paragraph>
                        {job.description}
                    </Typography>
                    <Typography variant="h6"><strong>Company:</strong> {job.companyName}</Typography>
                </CardContent>
            </Card>

            <Typography variant="h5" style={{ marginTop: '2rem' }}>Apply for this job</Typography>
            <form onSubmit={handleApply}>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    required
                />
                <TextField
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    required
                />
                <input
                    accept=".pdf"
                    style={{ display: 'none' }}
                    id="cv-upload"
                    type="file"
                    onChange={handleCvUpload}
                    required
                />
                <label htmlFor="cv-upload">
                    <Button variant="contained" component="span" style={{ margin: '1rem 0' }}>
                        Upload CV
                    </Button>
                </label>
                <Button variant="contained" color="primary" type="submit">
                    Submit Application
                </Button>
            </form>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={message.includes('Failed') ? 'error' : 'success'}>
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default JobPostDetail;
