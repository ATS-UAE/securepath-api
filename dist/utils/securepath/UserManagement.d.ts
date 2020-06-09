import { Api } from ".";
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
export declare class UserManagement extends Api {
    private static unionTrackers;
    private static exceptTrackers;
    getUsers: () => Promise<UserListItem[]>;
    getUserTrackers: (username: string) => Promise<GetUserTrackersReponse>;
    addTrackers: (username: string, ...trackers: string[]) => Promise<void>;
    removeTrackers: (username: string, ...trackers: string[]) => Promise<void>;
    setTrackers: (username: string, trackers: string[]) => Promise<void>;
}
