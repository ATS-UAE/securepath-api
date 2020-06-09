import { AxiosInstance, AxiosResponse } from "axios";
export interface ApiOptions {
    baseUrl: string;
}
export declare abstract class Api {
    api: AxiosInstance;
    options: ApiOptions;
    protected static isSecurepathForbidden: (response: AxiosResponse) => boolean;
    protected constructor(api: AxiosInstance, options: ApiOptions);
    checkLogin: () => Promise<void>;
}
