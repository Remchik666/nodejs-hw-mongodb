import express from 'express';
import { getContactsController, getContactByIdController, createContactController, deleteContactController, updateContactController } from '../controllers/contacts.js'
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post("/", ctrlWrapper(createContactController));

router.delete("/:contactId", ctrlWrapper(deleteContactController));

router.patch("/:contactId", ctrlWrapper(updateContactController));

export default router;