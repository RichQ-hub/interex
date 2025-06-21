import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize, align } = format;

/**
 * What this does:
 * Winston allows you to specify a custom logger which you can use throughout you're program to
 * log messages to the terminal explicitly in code.
 */

const logger = createLogger({
  // Only log entries with a minimum severity of debug (or maximum integer priority of 5) will be written while
  // all others are suppressed (won't log). This means that only the info, warn, and error messages will produce
  // output with the current configuration.
  level: 'debug',
  format: combine(
    // Tells winston that all the log messages have to be coloured.
    colorize({ all: true }),
    // Add a timestamp to each log message.
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.ms A',
    }),
    // Aligns the log messages for neater viewing.
    align(),
    // Prints the log message in a custom format.
    printf((info) => {
      return `[${info.timestamp}] ${info.level}: ${info.message}`;
    }),
  ),
  // We specify where we want to show the log messages. In this case, we are only showing those messages
  // in the terminal. (Can specify other places like files, etc).
  transports: [
    new transports.Console()
  ]
});

export default logger;

/**
 * Resources:
 * - https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/#customizing-log-levels-in-winston
 * - https://lioncoding.com/logging-in-express-js-using-winston-and-morgan/#:~:text=Morgan%20is%20a%20Node.,even%20a%20built%2Din%20profiler.
 */
