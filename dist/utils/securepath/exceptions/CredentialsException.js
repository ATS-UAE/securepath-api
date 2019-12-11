"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CredentialsException extends Error {
    constructor() {
        super("Login credentials mismatch.");
    }
}
exports.CredentialsException = CredentialsException;
