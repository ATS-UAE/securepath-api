"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeviceExistingException extends Error {
    constructor() {
        super("IMEI already exists.");
    }
}
exports.DeviceExistingException = DeviceExistingException;
