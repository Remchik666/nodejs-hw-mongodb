import { getAllContacts, getContactsById, createContact, deleteContact, updateContact } from "../services/contacts.js"
import createHttpError from "http-errors"; 


export async function getContactsController(req, res) {
    const contacts = await getAllContacts();

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
}

export async function getContactByIdController (req, res) {
    const { contactId } = req.params;
    const contact = await getContactsById(contactId);
    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
}

export async function createContactController(req, res) { 
    const contact = await createContact(req.body);
    
    res.status(201).json({
        status: 201, 
        message: 'Successfully created a contact!',
        data: contact
    })
}

export async function deleteContactController(req, res) {
    const { contactId } = req.params;
    const result = await deleteContact(contactId)
    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }
}

export async function updateContactController(req, res) {
    const result = await updateContact(req.params.contactId, req.body);

    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }
    res.json({status: 200, message: "Contact update successfully", data: result})
}