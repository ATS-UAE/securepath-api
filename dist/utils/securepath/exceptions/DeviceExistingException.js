"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceExistingException = void 0;
class DeviceExistingException extends Error {
    constructor() {
        super("IMEI already exists.");
    }
}
exports.DeviceExistingException = DeviceExistingException;
