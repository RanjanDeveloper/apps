/**
 * An array of routes only accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes = ["/","/auth/new-verification","/flames","/knowme","/knowme/friend2"];

/**
 * An array of routes used for authentications
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */

export const authRoutes = ["/auth/login","/auth/register","/auth/error",
"/auth/reset",
"/auth/new-password"
];

/**
 * The prefix for api authentication routes
 * Routes that start with this prefix are used for API authentication Purpose
 * @type {string[]}
 */
export const apiAuthPrefix = "/api";
/**
 * The default redirect path after logging in
 * @type {string[]}
 */
export const DEFAULT_LOGIN_REDIRECT =  "/dashboard/settings";