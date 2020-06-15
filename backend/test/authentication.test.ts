import app from '../src/app';

describe('authentication', () => {
  it('registered the authentication service', () => {
    expect(app.service('authentication')).toBeTruthy();
  });

  describe('local strategy', () => {
    const userInfo = {
      username: 'test',
      password: 'supersecret',
    };

    beforeAll(
      async (): Promise<void> => {
        try {
          await app.service('users').create(userInfo);
        } catch (error) {
          // Do nothing, it just means the user already exists and can be tested
        }
      }
    );

    it('authenticates user and creates accessToken', async (): Promise<
      void
    > => {
      const { user, accessToken } = await app.service('authentication').create({
        strategy: 'local',
        ...userInfo,
      });

      expect(accessToken).toBeTruthy();
      expect(user).toBeTruthy();
    });
  });
});
