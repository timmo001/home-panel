import app from '../../src/app';

describe("'controller' service", () => {
  it('registered the service', () => {
    const service = app.service('controller');
    expect(service).toBeTruthy();
  });
});
