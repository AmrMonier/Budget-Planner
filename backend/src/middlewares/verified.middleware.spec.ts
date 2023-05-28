import { VerifiedMiddleware } from './verified.middleware';

describe('VerifiedMiddleware', () => {
  it('should be defined', () => {
    expect(new VerifiedMiddleware()).toBeDefined();
  });
});
