"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurePath = void 0;
const axios_1 = __importDefault(require("axios"));
const md5_hex_1 = __importDefault(require("md5-hex"));
const _1 = require(".");
const __1 = require("..");
class SecurePath extends _1.Api {
    get authCookie() {
        return this.api.defaults.headers.Cookie;
    }
    get TrackerManagement() {
        return new _1.TrackerManagement(this.api, this.options);
    }
    get UserManagement() {
        return new _1.UserManagement(this.api, this.options);
    }
    get Live() {
        return new _1.Live(this.api, this.options);
    }
}
exports.SecurePath = SecurePath;
SecurePath.login = (username, password, options) => __awaiter(void 0, void 0, void 0, function* () {
    const api = axios_1.default.create({ withCredentials: true });
    const seed = yield api(`${options.baseUrl}/php/getpage.php?mode=login&fx=getSeed`, {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    const [setCookie] = seed.headers["set-cookie"];
    api.defaults.headers.Cookie = setCookie;
    const hash = md5_hex_1.default(password + seed.data);
    const queryString = __1.stringifyQuery({
        uname: username,
        hash,
        tz: "Asia/Dubai",
        language: "en"
    });
    yield api.post(`${options.baseUrl}/php/getpage.php?mode=login&fx=authenticate`, queryString, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    const sp = new SecurePath(api, options);
    try {
        yield sp.checkLogin();
    }
    catch (e) {
        if (e instanceof _1.AuthNeededException) {
            throw new _1.CredentialsException();
        }
        throw new Error("Unknown error");
    }
    return sp;
});
SecurePath.useCookie = (cookie, options) => __awaiter(void 0, void 0, void 0, function* () {
    const api = axios_1.default.create({ withCredentials: true });
    api.defaults.headers.Cookie = cookie;
    const sp = new SecurePath(api, options);
    try {
        yield sp.checkLogin();
    }
    catch (e) {
        if (e instanceof _1.AuthNeededException) {
            throw new _1.CredentialsException();
        }
        throw new Error("Unknown error");
    }
    return sp;
});
