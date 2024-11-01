// models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: String, required: true },
    qualifications: { type: String, required: true },
    job: { type: String, required: true },
    company: { type: String, required: true },
    skills: { type: String, required: true },
    match: { type: Boolean, required: true },
    score: { type: Number, required: true },
}, { timestamps: true });

const Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;
