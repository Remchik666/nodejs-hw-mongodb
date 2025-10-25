import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import Handlebars from 'handlebars';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { sendEmail } from '../utils/sendMail.js';

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw new createHttpError.Conflict('Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (user == null) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);
  if (session == null) {
    throw new createHttpError.Unauthorized('Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expire');
  }

  await Session.deleteOne({ userId: session.userId });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });
}
export async function requestResetToken(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError.NotFound('User not found');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '5m' },
  );

  const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = Handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html,
  });
}

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError.Unauthorized('Token is expired or invalid.');
    throw err;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError.BadRequest('User not found');
  }

  const session = await Session.findOne({ userId: user._id });
  if (session) {
    await logoutUser(session._id);
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};

export async function loginOrRegister(email, name) {
  let user = await User.findOne({ email });

  if (user == null) {
    const password = await bcrypt.hash(
      crypto.randomBytes(30).toString('base64'),
      10,
    );

    user = await User.create({ name, email, password });
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });
}
