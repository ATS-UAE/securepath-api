"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthNeededException = void 0;
class AuthNeededException extends Error {
    constructor() {
        super("Login is required.");
    }
}
exports.AuthNeededException = AuthNeededException;
