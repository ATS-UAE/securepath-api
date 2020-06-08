export class AuthNeededException extends Error {
	constructor() {
		super("Login is required.");
	}
}
