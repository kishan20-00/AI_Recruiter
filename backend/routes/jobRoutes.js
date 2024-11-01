const express = require('express');
const router = express.Router();
const JobPost = require('../models/job');

// Create a new job post
router.post('/', async (req, res) => {
    const { jobTitle, jobCategory, description, companyName } = req.body;
    
    try {
        const jobPost = new JobPost({ jobTitle, jobCategory, description, companyName });
        await jobPost.save();
        res.status(201).json(jobPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating job post', error });
    }
});

// Get all job posts
router.get('/', async (req, res) => {
    try {
        const jobPosts = await JobPost.find();
        res.status(200).json(jobPosts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job posts', error });
    }
});

// GET a specific job post by ID
router.get('/:id', async (req, res) => {
    try {
        const jobPost = await JobPost.findById(req.params.id); // Use the JobPost model to find by ID
        if (!jobPost) {
            return res.status(404).json({ message: 'Job post not found' });
        }
        res.json(jobPost);
    } catch (error) {
        console.error('Error fetching job post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
