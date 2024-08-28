import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

// Routers.
import authRoutes from '../routers/auth';
import communityRoutes from '../routers/communities';
import threadRoutes from '../routers/threads';
import commentRoutes from '../routers/comments';

const createServer = () => {
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
  app.use(`${rootRoute}/auth`, authRoutes);
  app.use(`${rootRoute}/communities`, communityRoutes);
  app.use(`${rootRoute}/threads`, threadRoutes);
  app.use(`${rootRoute}/comments`, commentRoutes);

  return app;
}

export default createServer;