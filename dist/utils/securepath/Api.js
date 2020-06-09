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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const _1 = require(".");
class Api {
    constructor(api, options) {
        this.api = api;
        this.options = options;
        this.checkLogin = () => __awaiter(this, void 0, void 0, function* () {
            const isLoggedIn = yield this.api.get(`${this.options.baseUrl}/php/getpage.php?mode=admin&fx=display`);
            if (Api.isSecurepathForbidden(isLoggedIn)) {
                throw new _1.AuthNeededException();
            }
        });
    }
}
exports.Api = Api;
Api.isSecurepathForbidden = (response) => {
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
