import express from 'express';
import { getContactsController, getContactByIdController, createContactController, deleteContactController, updateContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contact.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post("/", validateBody(createContactSchema), ctrlWrapper(createContactController));

router.delete("/:id", isValidId, ctrlWrapper(deleteContactController));

router.patch("/:id", validateBody(updateContactSchema), isValidId, ctrlWrapper(updateContactController));

export default router;