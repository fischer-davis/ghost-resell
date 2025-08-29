import { createAuthClient } from 'better-auth/react';

const serverPort = import.meta.env.VITE_SERVER_PORT || 3000;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || `http://localhost:${serverPort}`;

export const authClient = createAuthClient({
  baseURL: apiBaseUrl, // the base url of your auth server
});
