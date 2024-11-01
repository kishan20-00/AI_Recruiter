// src/JobPostForm.js
import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Select,
    MenuItem,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Box,
} from '@mui/material';

const JobPostForm = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [description, setJobDescription] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobCategory, setJobCategory] = useState('');

    // Sample job categories - you can modify this as needed
    const jobCategories = [
        'ACCOUNTANT',
        'ADVOCATE',
        'AGRICULTURE',
        'APPAREL',
        'INFORMATION-TECHNOLOGY',
        'BUSINESS-DEVELOPMENT',
        'FINANCE',
        'ENGINEERING',
        'CHEF',
        'AVIATION',
        'FITNESS',
        'SALES',
        'BANKING',
        'HEALTHCARE',
        'CONSULTANT',
        'CONSTRUCTION',
        'PUBLIC-RELATIONS',
        'HR',
        'DESIGNER',
        'ARTS',
        'TEACHER',
        'DIGITAL-MEDIA',
        'AUTOMOBILE',
        'BPO',
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/jobPosts', {
                jobTitle,
                jobCategory,
                description,
                companyName
            });
            alert('Job posted successfully!');
            setJobTitle('');
            setJobDescription('');
            setCompanyName('');
            setJobCategory(''); // Reset the job category
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Failed to post job.');
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '32px' }}>
            <Typography variant="h4" gutterBottom align="center">
                Add Job Vacancy
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Job Title"
                        variant="outlined"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                    />
                </Box>
                <Box mb={2}>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel>Job Category</InputLabel>
                        <Select
                            value={jobCategory}
                            onChange={(e) => setJobCategory(e.target.value)}
                            label="Job Category"
                        >
                            <MenuItem value="">
                                <em>Select a category</em>
                            </MenuItem>
                            {jobCategories.map((category, index) => (
                                <MenuItem key={index} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Job Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setJobDescription(e.target.value)}
                        required
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Company Name"
                        variant="outlined"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </Box>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default JobPostForm;
