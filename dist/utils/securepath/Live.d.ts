import { DeviceType, Api } from ".";
export declare enum LiveTrackerStatus {
    MOVING = "MOVING",
    IDLING = "IDLING",
    STOPPED = "STOPPED",
    NO_DATA = "NO_DATA",
    NO_GPS = "NO_GPS",
    NOT_WORKING = "NOT_WORKING",
    UNKNOWN = "UNKNOWN"
}
export interface GetTrackersResponse {
    name: string;
    fscode: DeviceType;
    tid: string;
    status: "s" | "g" | "n" | "m" | "i";
    IO?: string;
    privatePublic?: number;
    imei: string;
    trackerSerial: string;
    simno: string;
    searchKeywords: string;
    dateString: string;
    licensePlate: string;
    iconText: string;
    iconIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    hLocations: [];
    timestamp?: string;
    latitude?: string;
    longitude?: string;
    speed?: string;
    direction?: string;
    date?: string;
    time?: number;
    trackingType: string;
    cStamp: number;
    users?: string;
    timeString: string;
}
export interface LiveTrackerItem {
    trackerName: string;
    deviceType: DeviceType;
    trackerId: string;
    status: LiveTrackerStatus;
    imei: string;
    trackerSerial: string;
    simNo: string;
    searchKeywords: string;
    licensePlate: string;
    iconText: string;
    timestamp?: number;
    latitude?: number;
    longitude?: number;
    speed?: number;
    direction?: number;
    users?: string[];
    engineOn?: boolean;
}
export interface LoadHistoryResponse {
    mode: string;
    data: Array<{
        sdate: string;
        stime: number;
        edate: string;
        etime: number;
        name: string;
        dname: boolean;
        mode: string;
        data: Array<{
            _id: {
                $id: string;
            };
            datetime: {
                sec: number;
                usec: number;
            };
            time: number;
            timestamp: number;
            IO: string;
            odometer: number;
            driverId: string;
            siteId: string;
            private: number;
            misc: string;
            latitude: number;
            longitude: number;
            speed: number;
            direction: number;
            s: string;
            dateString: string;
        }>;
    }>;
}
export interface LiveTrackerMessage {
    sats: number;
    longitude: number;
    latitude: number;
    altitude: number;
    hdop?: number;
    odo?: number;
    ibutton?: string;
    speed: number;
    direction: number;
    ignitionOn: boolean;
    timestamp: number;
    sensors: {
        [key: string]: string;
    };
}
export declare class Live extends Api {
    private static getTrackerStatus;
    getTrackers(update?: boolean): Promise<LiveTrackerItem[]>;
    getHistory: (trackerId: string, from: number, to: number) => Promise<LiveTrackerMessage[]>;
}
