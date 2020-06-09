import { AxiosResponse } from "axios";
export declare abstract class AxiosHelpers {
    static isResponseHtml: (response: AxiosResponse) => boolean;
    static createAxiosInstanceWithSession: (cookieSession: string) => import("axios").AxiosInstance;
}
