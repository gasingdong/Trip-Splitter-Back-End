/* eslint-disable no-undef */

describe('server.js', () => {
  it('should set environment to testing', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });
});
