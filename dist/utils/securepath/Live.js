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
exports.Live = exports.LiveTrackerStatus = void 0;
const moment_1 = __importDefault(require("moment"));
const lodash_1 = __importDefault(require("lodash"));
const _1 = require(".");
const __1 = require("..");
var LiveTrackerStatus;
(function (LiveTrackerStatus) {
    LiveTrackerStatus["MOVING"] = "MOVING";
    LiveTrackerStatus["IDLING"] = "IDLING";
    LiveTrackerStatus["STOPPED"] = "STOPPED";
    LiveTrackerStatus["NO_DATA"] = "NO_DATA";
    LiveTrackerStatus["NO_GPS"] = "NO_GPS";
    LiveTrackerStatus["NOT_WORKING"] = "NOT_WORKING";
    LiveTrackerStatus["UNKNOWN"] = "UNKNOWN";
})(LiveTrackerStatus = exports.LiveTrackerStatus || (exports.LiveTrackerStatus = {}));
class Live extends _1.Api {
    constructor() {
        super(...arguments);
        this.getHistory = (trackerId, from, to) => __awaiter(this, void 0, void 0, function* () {
            yield this.checkLogin();
            const start = moment_1.default(from, "X");
            const end = moment_1.default(to, "X");
            const params = {
                sdate: start.format("YYYY-MM-DD"),
                shour: start.format("HH"),
                smin: start.format("mm"),
                edate: end.format("YYYY-MM-DD"),
                ehour: end.format("HH"),
                emin: end.format("mm"),
                template: "custom",
                tid: trackerId
            };
            const history = yield this.api.post(`${this.options.baseUrl}/php/getpage.php?mode=admin&fx=loadHistory`, __1.stringifyQuery(params), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            const messages = [];
            if (!(history.data instanceof Array)) {
                history.data.data.forEach((data) => {
                    data.data.forEach((message) => {
                        const misc = JSON.parse(message.misc);
                        messages.push({
                            sensors: lodash_1.default.omit(misc, "altitude", "sats", "hdop", "ibutton"),
                            altitude: lodash_1.default.pick(misc, "altitude").altitude,
                            sats: lodash_1.default.pick(misc, "sats").sats,
                            hdop: lodash_1.default.pick(misc, "hdop").hdop,
                            longitude: message.longitude,
                            latitude: message.latitude,
                            odo: lodash_1.default.pick(misc).odo || null,
                            ibutton: lodash_1.default.pick(misc, ["ibutton"]).ibutton || null,
                            speed: message.speed,
                            direction: message.direction,
                            ignitionOn: message.IO.includes("j"),
                            timestamp: message.timestamp
                        });
                    });
                });
            }
            return messages;
        });
    }
    getTrackers(update) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkLogin();
            const liveTrackers = yield this.api.get(`${this.options.baseUrl}/php/getpage.php?mode=admin&fx=getTrackers${update ? "&update=1" : ""}`);
            return liveTrackers.data.map(({ name, fscode, tid, imei, trackerSerial, simno, searchKeywords, licensePlate, iconText, iconIndex, timestamp, latitude, longitude, speed, direction, users, IO }) => ({
                trackerName: name,
                deviceType: fscode,
                trackerId: tid,
                status: Live.getTrackerStatus(iconIndex),
                engineOn: (IO && IO.includes("j")) || false,
                imei,
                trackerSerial,
                simNo: simno,
                searchKeywords,
                licensePlate,
                iconText,
                timestamp: (timestamp && Number(timestamp)) || undefined,
                latitude: (latitude && Number(latitude)) || undefined,
                longitude: (longitude && Number(longitude)) || undefined,
                speed: (speed && Number(speed)) || undefined,
                direction: (direction && Number(direction)) || undefined,
                users: (users && users.split(",")) || []
            }));
        });
    }
}
exports.Live = Live;
Live.getTrackerStatus = (code) => {
    switch (code) {
        case 0:
            return LiveTrackerStatus.MOVING;
        case 1:
            return LiveTrackerStatus.STOPPED;
        case 2:
            return LiveTrackerStatus.NO_DATA;
        case 3:
            return LiveTrackerStatus.NO_GPS;
        case 4:
            return LiveTrackerStatus.NOT_WORKING;
        default:
            return LiveTrackerStatus.UNKNOWN;
    }
};
