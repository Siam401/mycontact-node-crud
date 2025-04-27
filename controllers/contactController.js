const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const findContactByIdAndCheckOwnership = async (id, userId) => {
    const contact = await Contact.findById(id);
    if (!contact) {
        const error = new Error("Contact not found");
        error.statusCode = 404;
        throw error;
    }
    if (contact.user_id.toString() !== userId) {
        const error = new Error("User doesn't have permission to perform this action");
        error.statusCode = 403;
        throw error;
    }
    return contact;
};

const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    });

    res.status(201).json(contact);
});

const getContact = asyncHandler(async (req, res) => {
    const contact = await findContactByIdAndCheckOwnership(req.params.id, req.user.id);
    res.status(200).json(contact);
});

const updateContact = asyncHandler(async (req, res) => {
    await findContactByIdAndCheckOwnership(req.params.id, req.user.id);

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedContact);
});

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await findContactByIdAndCheckOwnership(req.params.id, req.user.id);

    await contact.deleteOne();

    res.status(200).json({ message: "Contact deleted successfully", contact });
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};
