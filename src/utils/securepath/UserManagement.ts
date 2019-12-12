import { SecurePath } from ".";
import moment = require("moment");

export interface ACCUsersListResponse {
	username: string;
	password: string;
	accounttype: string;
	creationtime: string;
	expirytime: string;
	company: string;
	name: string;
	gender: string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	zipcode: string;
	country: string;
	mobile: string;
	phone: string;
	email: string;
	website: string;
	noofretry: string;
	lastLogin: string;
	blocktime: string;
	imageLoaded: null;
	alertCentre: null;
	prevLogin?: string;
	features: string;
	reseller: string;
	creator: string;
	status: number;
	trackersCount: string;
}

export interface UserListItem {
	username: string;
	password: string;
	createdAt: number | string;
	expiryAt: number | string;
	companyName: string;
	fullName: string;
	gender: "m" | "f" | string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	mobile: string;
	phone: string;
	email: string;
	website: string;
	lastLogin: number | null;
	features: unknown;
	reseller: string;
	creator: string;
	status: number;
	trackerCount: number;
}

export interface TrackerMap {
	id: string;
	name: string;
	imei: string;
	simno: string;
	searchKeywords: string;
}

export interface GetTrackersMapResponse {
	ATL: TrackerMap[];
	NTL: TrackerMap[];
}

export interface GetUserTrackersReponse {
	in: TrackerMap[];
	out: TrackerMap[];
}

export class UserManagement extends SecurePath {
	// TODO: GET http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=ACCUsersList
	// TODO: POST  http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=getTrackersMap
	// { "Form data": { username: "ats.fast.ahmed" } };
	// TODO: http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=addTrackersMap
	// { username: string; list: string[] }
	public getUsers = async () => {
		await this.checkLogin();
		const users = await this.api.get<ACCUsersListResponse[]>(
			"http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=ACCUsersList"
		);

		return users.data.map<UserListItem>(user => ({
			username: user.username,
			password: user.password,
			createdAt: moment(user.creationtime, "YYYY-MM-DD").unix(),
			expiryAt: moment(user.expirytime, "YYYY-MM-DD").unix(),
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
	};

	public getUserTrackers = async (
		username: string
	): Promise<GetUserTrackersReponse> => {
		await this.checkLogin();
		const trackerList = await this.api.post<GetTrackersMapResponse>(
			"http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=getTrackersMap",
			{
				username
			}
		);
		return {
			in: trackerList.data.ATL,
			out: trackerList.data.NTL
		};
	};

	public addTrackers = async (username: string, ...trackers: string[]) => {
		const userTrackers = await this.getUserTrackers(username);

		const union = this.unionTrackers(
			userTrackers.in.map(t => t.id),
			trackers
		);

		await this.setTrackers(username, union);
	};

	public removeTrackers = async (username: string, ...trackers: string[]) => {
		const userTrackers = await this.getUserTrackers(username);

		const except = this.exceptTrackers(
			userTrackers.in.map(t => t.id),
			trackers
		);

		await this.setTrackers(username, except);
	};

	public setTrackers = async (username: string, trackers: string[]) => {
		await this.checkLogin();
		await this.api.post(
			"http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=addTrackersMap",
			{
				username,
				list: trackers
			}
		);
	};

	private unionTrackers = (list1: string[], list2: string[]) => {
		const result: string[] = list1;

		for (const tracker of list2) {
			if (!result.includes(tracker)) {
				result.push(tracker);
			}
		}

		return result;
	};

	private exceptTrackers = (list1: string[], list2: string[]) => {
		const result: string[] = list1;

		for (const tracker of list2) {
			const index = result.indexOf(tracker);
			if (index >= 0) {
				result.splice(index, 1);
			}
		}

		return result;
	};
}
