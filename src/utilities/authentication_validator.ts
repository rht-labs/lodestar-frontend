export abstract class AuthenticationValidator {
  private static _validator: () => Promise<boolean> = async () => true;
  public static get validator() {
    if (!AuthenticationValidator._validator) {
      AuthenticationValidator._validator = async () => true;
    }
    return AuthenticationValidator._validator;
  }
  public static set validator(authenticationValidator: () => Promise<boolean>) {
    AuthenticationValidator._validator = authenticationValidator;
  }
}
