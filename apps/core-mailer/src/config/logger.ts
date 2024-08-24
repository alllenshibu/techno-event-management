import { createLogger, format, Logger, transports } from 'winston';

export const logger: Logger = createLogger({
  level: 'info',
  format: format.cli(),
  transports: [new transports.Console()],
});
