export class DeviceExistingException extends Error {
	constructor() {
		super("IMEI already exists.");
	}
}
