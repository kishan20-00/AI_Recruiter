const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    jobCategory: { type: String, required: true },
    description: { type: String, required: true },
    companyName: { type: String, required: true }
});

module.exports = mongoose.model('JobPost', jobPostSchema);
