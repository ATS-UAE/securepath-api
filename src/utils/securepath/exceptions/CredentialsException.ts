export class CredentialsException extends Error {
	constructor() {
		super("Login credentials mismatch.");
	}
}
