import express from 'express';
import { registerUserController, loginUserController, logoutUserController, refreshSessionController, requestPasswordResetController, resetPasswordController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, requestPasswordResetSchema, resetPasswordSchema } from '../validation/auth.js';
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrlWrapper(registerUserController));
router.post("/login", validateBody(loginSchema), ctrlWrapper(loginUserController));
router.post("/logout", ctrlWrapper(logoutUserController));
router.post("/refresh", ctrlWrapper(refreshSessionController));
router.post("/request-password-reset", validateBody(requestPasswordResetSchema), ctrlWrapper(requestPasswordResetController));
router.post("/reset-password", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default router;