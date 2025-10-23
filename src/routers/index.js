import express from "express";
import contactRoutes from './contacts.js';
import authRouter from './auth.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.use("/auth", authRouter);
router.use("/contacts", auth, contactRoutes);

export default router;