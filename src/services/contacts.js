import { ContactsCollection } from '../db/models/contacts.js';

export async function getAllContacts({ page, perPage, sortBy, sortOrder }) {
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const [contacts, totalItems] = await Promise.all([
        ContactsCollection.find().sort({[sortBy]: sortOrder}).skip(skip).limit(perPage),
        ContactsCollection.countDocuments()
    ]);
    const totalPages = Math.ceil(totalItems / perPage);



    return {
        data: contacts,
        totalItems,
        page, 
        perPage,
        totalPages,
        hasNextPage: totalPages > page,
        hasPreviousPage: page > 1,
    };
}

export function getContactsById(id) {
    const contacts = ContactsCollection.findById(id);
    return contacts;
}

export function createContact(payload) { 
    return ContactsCollection.create(payload);
}

export function deleteContact(id) { 
    return ContactsCollection.findByIdAndDelete(id);
}

export function updateContact(id, payload) { 
    return ContactsCollection.findByIdAndUpdate(id, payload, {new: true}); 
}