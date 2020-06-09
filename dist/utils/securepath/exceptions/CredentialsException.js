"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsException = void 0;
class CredentialsException extends Error {
    constructor() {
        super("Login credentials mismatch.");
    }
}
exports.CredentialsException = CredentialsException;
