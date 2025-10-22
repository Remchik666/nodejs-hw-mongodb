import { getAllContacts, getContactsById, createContact, deleteContact, updateContact } from "../services/contacts.js";
import createHttpError from "http-errors"; 
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';


export async function getContactsController(req, res) {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder });

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
}

export async function getContactByIdController (req, res) {
    const { id } = req.params;
    const contact = await getContactsById(id);
    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data: contact,
    });
}

export async function createContactController(req, res) { 
    const contact = await createContact(req.body);
    
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact
    });
}

export async function deleteContactController(req, res) {
    const { id } = req.params;
    const result = await deleteContact(id);
    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send();
}

export async function updateContactController(req, res) {
    const result = await updateContact(req.params.contactId, req.body);

    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }
    res.json({ status: 200, message: "Contact update successfully", data: result });
}