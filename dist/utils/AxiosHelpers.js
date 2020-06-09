"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosHelpers = void 0;
const axios_1 = __importDefault(require("axios"));
class AxiosHelpers {
}
exports.AxiosHelpers = AxiosHelpers;
AxiosHelpers.isResponseHtml = (response) => {
    const contentType = response.headers["Content-Type"];
    if (contentType.search("text/html") < 0) {
        return false;
    }
    return true;
};
AxiosHelpers.createAxiosInstanceWithSession = (cookieSession) => {
    const api = axios_1.default.create({ withCredentials: true });
    api.defaults.headers.Cookie = cookieSession;
    return api;
};
