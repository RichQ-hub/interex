import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import logger from './utils/logger';

// Routers.
import communities from './routers/communities';
import threads from './routers/threads';
import comments from './routers/comments';
import auth from './routers/auth';

// Need to specify the direct path to the .env file to have access to its variables.
// Resource: https://stackoverflow.com/questions/42335016/dotenv-file-is-not-loading-environment-variables (2nd answer).
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// This means that if the environment variable for port doesn't exist, we
// set it to the default value of 3000.
const port = process.env.PORT || 3000;

// Initialise the express app.
const app: Express = express();

// --------------------------------------------------------------------------------
// Middleware
// --------------------------------------------------------------------------------

/**
 * Cross-Origin Resource Sharing (CORS) or "Same Origin Policy" basically states
 * that only requests from the same origin (the same IP address or URL) should 
 * be allowed to access this API.
 * 
 * For now, it is acceptable to just allow access from any origin. This makes 
 * development quite a bit easier but for any real project, once you deploy to 
 * a production environment you will probably want to specifically block access 
 * from any origin except your frontend website. 
 */
app.use(cors());

/**
 * Morgan allows us to log useful information regarding incoming requests into
 * the terminal.
 */
app.use(morgan('dev'))

/**
 * Helmet is designed to enhance the security of web applications by setting various
 * HTTP headers. These headers can help protect your application from common web
 * vulnerabilities, such as Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF),
 * and others.
 */
app.use(helmet());

/**
 * Extracts the incoming JSON request payload data and parses it into the req.body
 * object, which can be treated as a normal javascript object within controllers.
 */
app.use(express.json());

// --------------------------------------------------------------------------------
// Server Routes
// --------------------------------------------------------------------------------

const rootRoute = '/api/v1';
app.use(`${rootRoute}/communities`, communities);
app.use(`${rootRoute}/threads`, threads);
app.use(`${rootRoute}/comments`, comments);
app.use(`${rootRoute}/auth`, auth);

// --------------------------------------------------------------------------------
// Server Listen
// --------------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`⚡️[Server]: Server is running at http://localhost:${port}/`);
});
