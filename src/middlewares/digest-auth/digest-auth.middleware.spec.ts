import { DigestAuthMiddleware } from './digest-auth.middleware';

describe('DigestAuthMiddleware', () => {
  it('should be defined', () => {
    expect(new DigestAuthMiddleware()).toBeDefined();
  });
});
