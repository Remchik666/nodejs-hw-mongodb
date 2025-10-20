import { ContactsCollection } from '../db/models/contacts.js';

export function getAllContacts() {
    const contacts =  ContactsCollection.find();
    return contacts;
}

export function getContactsById(contactId) {
    const contacts = ContactsCollection.findById(contactId);
    return contacts;
}

export function createContact(payload) { 
    return ContactsCollection.create(payload);
}

export function deleteContact(contactId) { 
    return ContactsCollection.findByIdAndDelete(contactId);
}

export function updateContact(contactId, payload) { 
    return ContactsCollection.findByIdAndUpdate(contactId, payload, {new: true}); 
}