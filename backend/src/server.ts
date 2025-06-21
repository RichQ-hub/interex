import dotenv from 'dotenv';
import path from 'path';

import createServer from './config/server';

// Need to specify the direct path to the .env file to have access to its variables.
// Resource: https://stackoverflow.com/questions/42335016/dotenv-file-is-not-loading-environment-variables (2nd answer).
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// This means that if the environment variable for port doesn't exist, we
// set it to the default value of 3000.
const port = process.env.BACKEND_PORT || 3000;

const app = createServer();

app.listen(port, () => {
  console.log(`⚡️ [Server]: Server is running at http://localhost:${port}/`);
});
