import { OAuth2Client } from 'google-auth-library';
import { getEnvVar } from './getEnvVar.js';

const client = new OAuth2Client({
  clientId: getEnvVar('GOOGLE_CLIENT_ID'),
  clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
  redirectUri: getEnvVar('GOOGLE_REDIRECT_URI'),
});
