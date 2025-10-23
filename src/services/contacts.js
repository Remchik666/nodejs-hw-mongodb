import { ContactsCollection } from '../db/models/contacts.js';

export async function getAllContacts({ page, perPage, sortBy, sortOrder, userId }) {
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const [contacts, totalItems] = await Promise.all([
        ContactsCollection.find({userId}).sort({[sortBy]: sortOrder}).skip(skip).limit(perPage),
        ContactsCollection.countDocuments({userId})
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

export async function getContactsById(id, userId) {
    const contact = await ContactsCollection.findOne({ _id: id, userId });
    return contact;
}

export function createContact(payload) { 
    return ContactsCollection.create(payload);
}

export function deleteContact(id, userId) { 
    return ContactsCollection.findOneAndDelete({ _id: id, userId });
}

export function updateContact(id, payload, userId) { 
    return ContactsCollection.findOneAndUpdate({ _id: id, userId }, payload, {new: true}); 
}