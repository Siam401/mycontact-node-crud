const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")

const getContacts = asyncHandler(async  (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id })
    res.status(200).json(contacts);
})

const createContacts = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { name,email,phone } = req.body

    if(!name || !email ||!phone){
        res.status(400)
        throw new Error("All field is mandatory")
    }

    const contact = await Contact.create({
        name, email, phone, user_id: req.user.id
    })

    res.status(201).json(contact);
})

const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)
    
    if (! contact){
        res.status(404)
        throw new Error("Contact not found")
    }

    res.status(200).json(contact);
})

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
        res.status(404)
        throw new Error("Contact not found")
    }

    if(contact.user_id.toString() !== req.user.id) {
        res.status(403)
        throw new Error("User doesn't have the permission to update the contact")
    }

    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.status(200).json(updateContact);
})

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
        res.status(404)
        throw new Error("Contact not found")
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403)
        throw new Error("User doesn't have the permission to update the contact")
    }

    await contact.deleteOne();

    res.status(200).json(contact);
})

module.exports = { getContacts, createContacts, getContact, updateContact, deleteContact }