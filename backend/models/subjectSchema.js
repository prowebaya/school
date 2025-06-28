const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Theory', 'Practical'],
        default: 'Theory'
    }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);