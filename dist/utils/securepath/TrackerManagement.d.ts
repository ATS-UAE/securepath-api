import { SecurePath } from "./SecurePath";
export declare type DeviceType = "GP-01" | "RP-01" | "TT-01" | "TT-02" | "VT62";
export interface TrackerData {
    trackerName: string;
    imei: string;
    deviceType: DeviceType;
    trackerSerial: string;
    protocol?: "tcp" | "udp";
    dateOfInstallation?: Date;
    licensePlate: string;
    iconText: string;
    trackerExpiry?: Date;
    simProvider?: string;
    simValidity?: Date;
    chassisNo: string;
    dateOfPurchase?: string;
    simNo: string;
    simSerial: string;
    simPackage?: string;
    registeredEmail?: string;
    searchKeywords?: string;
    remarks?: string;
    odometerSensor?: boolean;
    odometerValue?: number;
    ignitionSensor?: boolean;
}
export declare class TrackerManagement extends SecurePath {
    createTracker: (data: TrackerData) => Promise<string>;
    updateTracker: (trackerId: string, data: TrackerData) => Promise<void>;
    private checkExistingImei;
    private getDefaultTrackerData;
}
