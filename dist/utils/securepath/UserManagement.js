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
exports.UserManagement = void 0;
const moment_1 = __importDefault(require("moment"));
const _1 = require(".");
const helpers_1 = require("../helpers");
class UserManagement extends _1.Api {
    constructor() {
        super(...arguments);
        this.getUsers = () => __awaiter(this, void 0, void 0, function* () {
            yield this.checkLogin();
            const users = yield this.api.get(`${this.options.baseUrl}/php/getpage.php?mode=admin&fx=ACCUsersList`);
            return users.data.map((user) => ({
                username: user.username,
                password: user.password,
                createdAt: moment_1.default(user.creationtime, "YYYY-MM-DD").unix(),
                expiryAt: moment_1.default(user.expirytime, "YYYY-MM-DD").unix(),
                companyName: user.company,
                fullName: user.name,
                gender: user.gender,
                address1: user.address1,
                address2: user.address2,
                city: user.city,
                state: user.state,
                zipCode: user.zipcode,
                country: user.country,
                mobile: user.mobile,
                phone: user.phone,
                email: user.email,
                website: user.website,
                lastLogin: (user.prevLogin && Number(user.prevLogin)) || null,
                features: JSON.parse(user.features),
                reseller: user.reseller,
                creator: user.creator,
                status: user.status,
                trackerCount: Number(user.trackersCount)
            }));
        });
        this.getUserTrackers = (username) => __awaiter(this, void 0, void 0, function* () {
            yield this.checkLogin();
            const trackerList = yield this.api.post(`${this.options.baseUrl}/php/getpage.php?mode=admin&fx=getTrackersMap`, helpers_1.stringifyQuery({ username }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            return {
                in: trackerList.data.ATL,
                out: trackerList.data.NTL
            };
        });
        this.addTrackers = (username, ...trackers) => __awaiter(this, void 0, void 0, function* () {
            const userTrackers = yield this.getUserTrackers(username);
            const union = UserManagement.unionTrackers(userTrackers.in.map((t) => t.id), trackers);
            yield this.setTrackers(username, union);
        });
        this.removeTrackers = (username, ...trackers) => __awaiter(this, void 0, void 0, function* () {
            const userTrackers = yield this.getUserTrackers(username);
            const except = UserManagement.exceptTrackers(userTrackers.in.map((t) => t.id), trackers);
            yield this.setTrackers(username, except);
        });
        this.setTrackers = (username, trackers) => __awaiter(this, void 0, void 0, function* () {
            yield this.checkLogin();
            yield this.api.post(`${this.options.baseUrl}/php/getpage.php?mode=admin&fx=addTrackersMap`, helpers_1.stringifyQuery({ username, list: trackers }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        });
    }
}
exports.UserManagement = UserManagement;
UserManagement.unionTrackers = (list1, list2) => {
    const result = list1;
    list2.forEach((tracker) => {
        if (!result.includes(tracker)) {
            result.push(tracker);
        }
    });
    return result;
};
UserManagement.exceptTrackers = (list1, list2) => {
    const result = [];
    list1.forEach((tracker) => {
        if (list2.indexOf(tracker) < 0) {
            result.push(tracker);
        }
    });
    return result;
};
