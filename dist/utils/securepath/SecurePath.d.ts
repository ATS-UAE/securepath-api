import { AxiosInstance, AxiosResponse } from "axios";
import { TrackerManagement } from "..";
export declare class SecurePath {
    protected api: AxiosInstance;
    static login: (username: string, password: string) => Promise<SecurePath>;
    static useCookie: (cookie: string) => Promise<SecurePath>;
    protected static isSecurepathForbidden: (response: AxiosResponse<any>) => boolean;
    protected constructor(api: AxiosInstance);
    checkLogin: () => Promise<void>;
    TrackerManagement: () => TrackerManagement;
}
