// routes/applicationRoutes.js
const express = require('express');
const Application = require('../models/Application');

const router = express.Router();

// POST a new application
router.post('/', async (req, res) => {
    const { name, phone, experience, qualifications, job, company, skills, match, score } = req.body;

    const newApplication = new Application({
        name,
        phone,
        experience,
        qualifications,
        job,
        company,
        skills,
        match,
        score,
    });

    try {
        const savedApplication = await newApplication.save();
        res.status(201).json(savedApplication);
    } catch (error) {
        res.status(500).json({ error: 'Error saving application' });
    }
});

// GET all applications
router.get('/', async (req, res) => {
    try {
        const applications = await Application.find();
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching applications' });
    }
});

module.exports = router;
