/* eslint-disable no-console */
const http = require('http');
const https = require('https');
const fs = require('fs');
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');

let server;
if (fs.existsSync(process.env.SSL_PATH_CERT || 'fullchain.pem')) {
  server = https.createServer(
    {
      cert: fs
        .readFileSync(process.env.SSL_PATH_CERT || 'fullchain.pem')
        .toString(),
      key: fs.readFileSync(process.env.SSL_PATH_KEY || 'privkey.pem').toString()
    },
    app
  ).listen(port);
} else {
  server = http.createServer(app).listen(port);
  console.warn('SSL (HTTPS) is not active!!!');
}

app.setup(server);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(
    'API started on %s://%s:%d',
    fs.existsSync(process.env.SSL_PATH_CERT || 'fullchain.pem')
      ? 'https'
      : 'http',
    app.get('host'),
    port
  )
);
