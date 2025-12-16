import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { clerkMiddleware, getAuth } from '@clerk/express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { join } from 'node:path';

dotenv.config();

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(cookieParser());
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use(
  clerkMiddleware({
    secretKey: process.env?.['CLERK_SECRET_KEY'],
    publishableKey: process.env?.['CLERK_PUBLISHABLE_KEY'],
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use(async (req, res, next) => {
  const { userId, isAuthenticated, getToken } = getAuth(req);
  let token: string | null = null;
  try {
    token = await getToken({ template: 'jwt-ssr' });
  } catch (error) {
    console.error(error);
  }
  const { theme } = req.cookies;
  angularApp
    .handle(req, {
      state: {
        authUser: { userId, isAuthenticated, token },
        theme,
      },
    })
    .then((response) => {
      return response ? writeResponseToNodeResponse(response, res) : next();
    })
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
