import { AxiosInstance, AxiosResponse } from "axios";
import { TrackerManagement, Live } from ".";
export declare class SecurePath {
    api: AxiosInstance;
    static login: (username: string, password: string) => Promise<SecurePath>;
    static useCookie: (cookie: string) => Promise<SecurePath>;
    protected static isSecurepathForbidden: (response: AxiosResponse<any>) => boolean;
    protected constructor(api: AxiosInstance);
    checkLogin: () => Promise<void>;
    get authCookie(): string;
    get TrackerManagement(): TrackerManagement;
    get Live(): Live;
}
