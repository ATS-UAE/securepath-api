import { TrackerManagement, Live, UserManagement, Api, ApiOptions } from ".";
export declare class SecurePath extends Api {
    static login: (username: string, password: string, options: ApiOptions) => Promise<SecurePath>;
    static useCookie: (cookie: string, options: ApiOptions) => Promise<SecurePath>;
    get authCookie(): string;
    get TrackerManagement(): TrackerManagement;
    get UserManagement(): UserManagement;
    get Live(): Live;
}
