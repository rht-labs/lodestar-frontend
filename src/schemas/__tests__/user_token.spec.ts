import { UserToken, LocalStoragePersistence } from '../user_token';

describe('User Token', () => {
  afterEach(() => {
    localStorage.clear();
  });
  test('can save and retrieve user token', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    expect(() =>
      UserToken.setPersistenceStrategy(new LocalStoragePersistence())
    ).not.toThrowError();
    UserToken.token = {
      accessToken: 'token',
      refreshToken: 'refresh token',
      accessTokenExpiry: new Date(2020, 1, 1),
      refreshTokenExpiry: new Date(2020, 1, 1),
    };
    let gotToken = UserToken.token;
    expect(setSpy).toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalled();
  });
  test('returns null if stored token does not exist', () => {
    UserToken.setPersistenceStrategy(new LocalStoragePersistence());
    expect(UserToken.token).toBe(null);
  });
  test('returns null if an error is thrown while retrieving or parsing a stored token', () => {
    UserToken.setPersistenceStrategy(new LocalStoragePersistence());
    localStorage.setItem('token', JSON.stringify({ 'a bad token': true }));
    expect(UserToken.token).toBe(null);
  });
});
