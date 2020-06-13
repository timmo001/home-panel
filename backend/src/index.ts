import http from 'http';
import https from 'https';
import fs from 'fs';
import logger from './logger';
import app from './app';

const port = app.get('port');

let server;
const isSsl = fs.existsSync(process.env.SSL_PATH_CERT || 'fullchain.pem');
if (isSsl) {
  server = https
    .createServer(
      {
        cert: fs
          .readFileSync(process.env.SSL_PATH_CERT || 'fullchain.pem')
          .toString(),
        key: fs
          .readFileSync(process.env.SSL_PATH_KEY || 'privkey.pem')
          .toString(),
      },
      app
    )
    .listen(port);
} else {
  server = http.createServer(app).listen(port);
}

app.setup(server);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  process.env.SUPPRESS_URL === 'true'
    ? logger.info('API started')
    : logger.info(
        'API started on %s://%s:%d',
        isSsl ? 'https' : 'http',
        app.get('host'),
        port
      )
);
