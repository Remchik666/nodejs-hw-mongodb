import { getAllContacts, getContactsById, createContact, deleteContact, updateContact } from "../services/contacts.js";
import createHttpError from "http-errors"; 
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { getEnvVar } from "../utils/getEnvVar.js";


export async function getContactsController(req, res) {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, userId: req.user.id });

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
}

export async function getContactByIdController (req, res) {
    const { id } = req.params;
    const contact = await getContactsById(id, req.user.id);

    if (!contact) {
        throw new createHttpError.NotFound('Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data: contact,
    });

    

}

export async function createContactController(req, res) { 
    let avatar;

    if (getEnvVar("UPLOAD_CLOUDINARY") == "true") {
        const response = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);

        avatar = response.secure_url;
    } else { 
        avatar = `http://localhost:3000/avatars/${req.file.filename}`;
        await fs.rename(req.file.path, path.resolve("src/uploads/avatars", req.file.filename));
    }

    const contact = await createContact({ ...req.body, avatar, userId: req.user.id });
    
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact
    });
}

export async function deleteContactController(req, res) {
    const { id } = req.params;

    const result = await deleteContact(id, req.user.id);
    if (!result) {
        throw new createHttpError.NotFound('Contact not found');
    }
    res.status(204).send();
}

export async function updateContactController(req, res) {
    const result = await updateContact(req.params.id, req.body, req.user.id);

    if (!result) {
        throw new createHttpError.NotFound('Contact not found');
    }
    res.json({ status: 200, message: "Contact update successfully", data: result });
}