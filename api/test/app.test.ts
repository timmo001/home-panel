import { Server } from 'http';
import url from 'url';
import axios from 'axios';

import app from '../src/app';

const port = app.get('port') || 8998;
const getUrl = (pathname?: string) =>
  url.format({
    hostname: app.get('host') || 'localhost',
    protocol: 'http',
    port,
    pathname
  });

describe('Feathers application tests (with jest)', () => {
  let server: Server;

  beforeAll(done => {
    server = app.listen(port);
    server.once('listening', () => done());
  });

  afterAll(done => {
    server.close(done);
  });

  describe('404', () => {
    it('shows a 404 HTML page', async (): Promise<void> => {
      expect.assertions(2);

      try {
        await axios.get(getUrl('path/to/nowhere'), {
          headers: {
            Accept: 'text/html'
          }
        });
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data.indexOf('<html>')).not.toBe(-1);
      }
    });

    it('shows a 404 JSON error without stack trace', async (): Promise<void> => {
      expect.assertions(4);

      try {
        await axios.get(getUrl('path/to/nowhere'));
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data.code).toBe(404);
        expect(response.data.message).toBe('Page not found');
        expect(response.data.name).toBe('NotFound');
      }
    });
  });
});
