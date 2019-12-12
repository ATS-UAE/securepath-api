import moment from "moment";
import _ from "lodash";
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
			_id: { $id: string };
			datetime: { sec: number; usec: number };
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
	sensors: { [key: string]: string };
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

	public async getTrackers(update?: boolean) {
		await this.checkLogin();

		const liveTrackers = await this.api.get<GetTrackersResponse[]>(
			`http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=getTrackers${
				update ? "&update=1" : ""
			}`
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
				users,
				IO
			}) => ({
				trackerName: name,
				deviceType: fscode,
				trackerId: tid,
				status: Live.getTrackerStatus(iconIndex),
				engineOn: IO && IO.includes("j") ? true : false,
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

	public getHistory = async (trackerId: string, from: number, to: number) => {
		await this.checkLogin();

		const start = moment(from, "X");
		const end = moment(to, "X");

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

		const history = await this.api.post<LoadHistoryResponse | []>(
			"http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=loadHistory",
			params
		);

		const messages: LiveTrackerMessage[] = [];

		if (!(history.data instanceof Array)) {
			history.data.data.forEach(data => {
				data.data.forEach(data => {
					const misc = JSON.parse(data.misc);
					messages.push({
						sensors: _.omit(misc, "altitude", "sats", "hdop", "ibutton"),
						altitude: _.pick(misc, "altitude").altitude,
						sats: _.pick(misc, "sats").sats,
						hdop: _.pick(misc, "hdop").hdop,
						longitude: data.longitude,
						latitude: data.latitude,
						odo: _.pick(misc).odo || null,
						ibutton: _.pick(misc, ["ibutton"]).ibutton || null,
						speed: data.speed,
						direction: data.direction,
						ignitionOn: data.IO.includes("j") ? true : false,
						timestamp: data.timestamp
					});
				});
			});
		}

		return messages;
	};
}
