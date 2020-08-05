import { UserProfile } from '../user_profile';
describe('User Profile', () => {
  test('gets correct display name', () => {
    expect(
      UserProfile.getDisplayName({
        firstName: 'John',
      })
    ).toEqual('John');
    expect(
      UserProfile.getDisplayName({
        email: 'john@example.com',
      })
    ).toEqual('john@example.com');
    expect(UserProfile.getDisplayName({})).toEqual('');
  });
});
