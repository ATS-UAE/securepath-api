import { SecurePath, DeviceType } from ".";

export enum LiveTrackerStatus {
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
	status: "s" | "g" | "n" | "m" | "i"; // i = yellow m = green s = "red" g = "purple" n = "black" n = "black green"
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
	trackerName: string; // name
	deviceType: DeviceType; // fscode
	trackerId: string; // tid
	status: LiveTrackerStatus;
	imei: string;
	trackerSerial: string;
	simNo: string; // simno
	searchKeywords: string;
	licensePlate: string;
	iconText: string;
	timestamp?: number;
	latitude?: number;
	longitude?: number;
	speed?: number;
	direction?: number;
	users?: string[];
}

export class Live extends SecurePath {
	private static getTrackerStatus = (code: number): LiveTrackerStatus => {
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

	public async getTrackers() {
		await this.checkLogin();

		const liveTrackers = await this.api.get<GetTrackersResponse[]>(
			"http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=getTrackers"
		);

		return liveTrackers.data.map<LiveTrackerItem>(
			({
				name,
				fscode,
				tid,
				imei,
				trackerSerial,
				simno,
				searchKeywords,
				licensePlate,
				iconText,
				iconIndex,
				timestamp,
				latitude,
				longitude,
				speed,
				direction,
				users
			}) => ({
				trackerName: name,
				deviceType: fscode,
				trackerId: tid,
				status: Live.getTrackerStatus(iconIndex),
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
			})
		);
	}
}
