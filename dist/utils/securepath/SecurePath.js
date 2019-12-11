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
const axios_1 = __importDefault(require("axios"));
const md5_hex_1 = __importDefault(require("md5-hex"));
const __1 = require("..");
const __2 = require("..");
const CredentialsException_1 = require("./exceptions/CredentialsException");
const AuthNeededException_1 = require("./exceptions/AuthNeededException");
class SecurePath {
    constructor(api) {
        this.api = api;
        this.checkLogin = () => __awaiter(this, void 0, void 0, function* () {
            const isLoggedIn = yield this.api.get("http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=display");
            if (SecurePath.isSecurepathForbidden(isLoggedIn)) {
                throw new CredentialsException_1.CredentialsException();
            }
        });
        this.TrackerManagement = () => {
            return new __1.TrackerManagement(this.api);
        };
    }
}
exports.SecurePath = SecurePath;
SecurePath.login = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const api = axios_1.default.create({ withCredentials: true });
    const seed = yield api("http://securepath.atsuae.net/php/getpage.php?mode=login&fx=getSeed", {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    api.defaults.headers.Cookie = seed.headers["set-cookie"][0];
    const hash = md5_hex_1.default(password + seed.data);
    const queryString = __2.stringifyQuery({
        uname: username,
        hash,
        tz: "Asia/Dubai",
        language: "en"
    });
    yield api.post("http://securepath.atsuae.net/php/getpage.php?mode=login&fx=authenticate", queryString, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    const sp = new SecurePath(api);
    try {
        yield sp.checkLogin();
    }
    catch (e) {
        if (e instanceof AuthNeededException_1.AuthNeededException) {
            throw new CredentialsException_1.CredentialsException();
        }
        throw new Error("Unknown error");
    }
    return sp;
});
SecurePath.useCookie = (cookie) => __awaiter(void 0, void 0, void 0, function* () {
    const api = axios_1.default.create({ withCredentials: true });
    api.defaults.headers.Cookie = cookie;
    const sp = new SecurePath(api);
    try {
        yield sp.checkLogin();
    }
    catch (e) {
        if (e instanceof AuthNeededException_1.AuthNeededException) {
            throw new CredentialsException_1.CredentialsException();
        }
        throw new Error("Unknown error");
    }
    return sp;
});
SecurePath.isSecurepathForbidden = (response) => {
    if (typeof response.data === "string" &&
        response.data.search("Redirecting to login page .. Please wait") > 0) {
        return true;
    }
    try {
        JSON.stringify(response.data);
        return false;
    }
    catch (e) {
        return true;
    }
};
