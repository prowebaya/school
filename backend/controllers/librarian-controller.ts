const Librarian = require('../models/librarian-model.ts'); // Librarian ka model

// ✅ Librarian Register
exports.librarianRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newLibrarian = new Librarian({ name, email, password });
        await newLibrarian.save();
        res.status(201).json({ message: "Librarian Registered Successfully", newLibrarian });
    } catch (error) {
        res.status(500).json({ message: "Error in Librarian Registration", error });
    }
};

// ✅ Librarian Login
exports.librarianLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const librarian = await Librarian.findOne({ email, password });
        if (!librarian) return res.status(400).json({ message: "Invalid Credentials" });
        res.status(200).json({ message: "Librarian Logged In Successfully", librarian });
    } catch (error) {
        res.status(500).json({ message: "Login Failed", error });
    }
};

// ✅ Librarian List
exports.getLibrarians = async (req, res) => {
    try {
        const librarians = await Librarian.find();
        res.status(200).json(librarians);
    } catch (error) {
        res.status(500).json({ message: "Error fetching librarians", error });
    }
};

// ✅ Single Librarian Detail
exports.getLibrarianDetail = async (req, res) => {
    try {
        const librarian = await Librarian.findById(req.params.id);
        if (!librarian) return res.status(404).json({ message: "Librarian not found" });
        res.status(200).json(librarian);
    } catch (error) {
        res.status(500).json({ message: "Error fetching librarian details", error });
    }
};

// ✅ Delete Librarian
exports.deleteLibrarian = async (req, res) => {
    try {
        await Librarian.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Librarian Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error Deleting Librarian", error });
    }
};
