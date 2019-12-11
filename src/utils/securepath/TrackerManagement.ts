import moment from "moment";
import { SecurePath } from "./SecurePath";
import { DeviceExistingException } from "./exceptions/DeviceExistingException";

export type DeviceType = "GP-01" | "RP-01" | "TT-01" | "TT-02" | "VT62";

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

export interface TrackerListItem {
	chassisNo: string;
	imei: string;
	licensePlate: string;
	trackerName: string;
	searchKeywords: string;
	simNo: string;
	trackerExpiry: number;
	trackerId: string;
	deviceType: DeviceType;
	users: string[];
}

export interface GetAllTrackerListResponse {
	chassisNo: string;
	imei: string;
	licensePlate: string;
	name: string;
	searchKeywords: string;
	simno: string;
	trackerExpiry: number;
	trackerId: string;
	type: DeviceType;
	users: string;
}

export class TrackerManagement extends SecurePath {
	public getTrackers = async (): Promise<TrackerListItem[]> => {
		await this.checkLogin();
		const trackers = await this.api.get<GetAllTrackerListResponse[]>(
			"http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=getAllTrackersList"
		);

		return trackers.data.map<TrackerListItem>(
			({
				chassisNo,
				imei,
				licensePlate,
				name,
				searchKeywords,
				simno,
				trackerId,
				trackerExpiry,
				type,
				users
			}) => ({
				chassisNo,
				imei,
				licensePlate,
				searchKeywords,
				trackerName: name,
				simNo: simno,
				trackerId,
				trackerExpiry,
				deviceType: type,
				users: users.split(",")
			})
		);
	};

	public createTracker = async (data: TrackerData) => {
		await this.checkLogin();

		const trackerId = await this.api.get<{ tid: string }>(
			"http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=getTrackerID"
		);

		await this.checkExistingImei(data.imei);

		const params = this.getDefaultTrackerData({
			...data,
			trackerId: trackerId.data.tid
		});

		await this.api.post(
			"http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=insertTrackerCard",
			params
		);

		return trackerId.data.tid;
	};

	public updateTracker = async (trackerId: string, data: TrackerData) => {
		await this.checkExistingImei(data.imei);

		const params = this.getDefaultTrackerData({
			...data,
			trackerId
		});

		await this.api.post(
			"http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=updateTrackerCard",
			params
		);
	};

	private checkExistingImei = async (imei: string) => {
		const existing = await this.api.get(
			`http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=validateIMEI&imei=${imei}`
		);

		if (existing.data.code === "exists") {
			throw new DeviceExistingException();
		}
	};

	private getDefaultTrackerData = (
		data: TrackerData & { trackerId: string }
	) => {
		const dateNow = moment().format("YYYY-MM-DD");
		const formData: { [key: string]: string } = {
			trackerid: data.trackerId,
			name: data.trackerName,
			imei: data.imei,
			type: data.deviceType || "TT-01",
			trackerSerial: data.trackerSerial,
			protocol: data.protocol || "tcp",
			dateOfInstallation: data.dateOfInstallation
				? moment(data.dateOfInstallation).format("YYYY-MM-DD")
				: dateNow,
			licensePlate: data.licensePlate.split(" ").join("+"),
			iconText: data.iconText,
			trackerExpiry: data.trackerExpiry
				? moment(data.trackerExpiry).format("YYYY-MM-DD")
				: dateNow,
			simProvider: data.simProvider || "",
			simValidity: data.simValidity
				? moment(data.simValidity).format("YYYY-MM-DD")
				: dateNow,
			chassisNo: data.chassisNo,
			dateOfPurchase: data.dateOfPurchase
				? moment(data.dateOfPurchase).format("YYYY-MM-DD")
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
