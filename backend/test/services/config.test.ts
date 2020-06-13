import app from '../../src/app';

describe("'config' service", () => {
  it('registered the service', () => {
    const service = app.service('config');
    expect(service).toBeTruthy();
  });
});
