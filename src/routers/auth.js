import express from 'express';
import { registerUserController, loginUserController, logoutUserController, refreshSessionController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrlWrapper(registerUserController));
router.post("/login", validateBody(loginSchema), ctrlWrapper(loginUserController));
router.post("/logout", ctrlWrapper(logoutUserController));
router.post("/refresh", ctrlWrapper(refreshSessionController));

export default router;