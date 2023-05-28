import { AuthenticatedMiddleware } from './authenticated.middleware';

describe('AuthenticatedMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthenticatedMiddleware()).toBeDefined();
  });
});
