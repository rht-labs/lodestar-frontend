export class AuthorizationError {}

export class AuthenticationError {
  constructor() {
    window.location.reload()
  }
}
