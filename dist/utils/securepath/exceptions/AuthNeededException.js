"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthNeededException extends Error {
    constructor() {
        super("Login is required.");
    }
}
exports.AuthNeededException = AuthNeededException;
