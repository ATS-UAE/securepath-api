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
const moment_1 = __importDefault(require("moment"));
const SecurePath_1 = require("./SecurePath");
const DeviceExistingException_1 = require("./exceptions/DeviceExistingException");
class TrackerManagement extends SecurePath_1.SecurePath {
    constructor() {
        super(...arguments);
        this.createTracker = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.checkLogin();
            const trackerId = yield this.api.get("http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=getTrackerID");
            yield this.checkExistingImei(data.imei);
            const params = this.getDefaultTrackerData(Object.assign(Object.assign({}, data), { trackerId: trackerId.data.tid }));
            yield this.api.post("http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=insertTrackerCard", params);
            return trackerId.data.tid;
        });
        this.updateTracker = (trackerId, data) => __awaiter(this, void 0, void 0, function* () {
            yield this.checkExistingImei(data.imei);
            const params = this.getDefaultTrackerData(Object.assign(Object.assign({}, data), { trackerId }));
            yield this.api.post("http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=updateTrackerCard", params);
        });
        this.checkExistingImei = (imei) => __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.api.get(`http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=validateIMEI&imei=${imei}`);
            if (existing.data.code === "exists") {
                throw new DeviceExistingException_1.DeviceExistingException();
            }
        });
        this.getDefaultTrackerData = (data) => {
            const dateNow = moment_1.default().format("YYYY-MM-DD");
            const formData = {
                trackerid: data.trackerId,
                name: data.trackerName,
                imei: data.imei,
                type: data.deviceType || "TT-01",
                trackerSerial: data.trackerSerial,
                protocol: data.protocol || "tcp",
                dateOfInstallation: data.dateOfInstallation
                    ? moment_1.default(data.dateOfInstallation).format("YYYY-MM-DD")
                    : dateNow,
                licensePlate: data.licensePlate.split(" ").join("+"),
                iconText: data.iconText,
                trackerExpiry: data.trackerExpiry
                    ? moment_1.default(data.trackerExpiry).format("YYYY-MM-DD")
                    : dateNow,
                simProvider: data.simProvider || "",
                simValidity: data.simValidity
                    ? moment_1.default(data.simValidity).format("YYYY-MM-DD")
                    : dateNow,
                chassisNo: data.chassisNo,
                dateOfPurchase: data.dateOfPurchase
                    ? moment_1.default(data.dateOfPurchase).format("YYYY-MM-DD")
                    : dateNow,
                simno: data.simNo,
                simSerial: data.simSerial,
                simPackage: data.simPackage || "",
                registeredEmail: "",
                enTempModel1: "0",
                enTempModel2: "0",
                enTempModel3: "0",
                enTempModel4: "0",
                enTempModel5: "0",
                enFuelModel1: "0",
                enFuelModel2: "0",
                enFuelModel3: "0",
                enFuelModel4: "0",
                enFuelModel5: "0",
                ATRIAccountNo: "",
                monitoringCentre: "DPS",
                driverID: "0",
                doors: "0",
                weightSensor: "0",
                odometerValue: data.odometerValue ? String(data.odometerValue) : "0",
                odometerSensor: data.odometerValue ? "1" : "0",
                smsLimitValue: "0",
                smsLimit: "0",
                CANBUS: "0",
                SOSButton: "0",
                fuelConsumption: "0",
                ignitionSensor: data.ignitionSensor ? "1" : "0",
                oneWire: "",
                privatePublicUse: "0",
                engineImmobilizer: "0",
                e2Input: "2",
                dualEngine: "0",
                emailLimitValue: "0",
                emailLimit: "0",
                searchKeywords: data.searchKeywords || "",
                remarks: data.remarks || ""
            };
            return formData;
        };
    }
}
exports.TrackerManagement = TrackerManagement;
