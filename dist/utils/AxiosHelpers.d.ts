import { AxiosResponse } from "axios";
export declare abstract class AxiosHelpers {
    static isResponseHtml: (response: AxiosResponse<any>) => boolean;
    static createAxiosInstanceWithSession: (cookieSession: string) => import("axios").AxiosInstance;
}
