import express from 'express';
import { getContactsController, getContactByIdController, createContactController, deleteContactController, updateContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contact.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post("/", upload.single("avatar"), validateBody(createContactSchema), ctrlWrapper(createContactController));

router.delete("/:id", isValidId, ctrlWrapper(deleteContactController));

router.patch("/:id", upload.single("avatar"), validateBody(updateContactSchema), isValidId, ctrlWrapper(updateContactController));



export default router;