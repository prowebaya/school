//const Subject = require('../models/subjectSchema.ts');

// const Subject = require('../models/subject-model.ts');

// Schema
const Subject = require('../models/subjectSchema');

// Create Subject
exports.createSubject = async (req, res) => {
    try {
        console.log("Creating Subject:", req.body);
        const { name, code, type } = req.body;

        // Check if subject with same code already exists
        const existingSubject = await Subject.findOne({ code });
        if (existingSubject) {
            return res.status(400).json({ message: 'Subject with this code already exists' });
        }

        const newSubject = new Subject({ name, code, type });
        await newSubject.save();
        res.status(201).json({ success: true, subject: newSubject });
    } catch (error) {
        console.error("Error in createSubject:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get all Subjects
exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Subject
exports.updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(
            req.params.id, 
            { 
                name: req.body.name,
                code: req.body.code,
                type: req.body.type 
            }, 
            { new: true }
        );
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Subject
exports.deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Subject by ID
exports.getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};