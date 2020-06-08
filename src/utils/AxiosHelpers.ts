import axios, { AxiosResponse } from "axios";

export abstract class AxiosHelpers {
	public static isResponseHtml = (response: AxiosResponse): boolean => {
		const contentType: string = response.headers["Content-Type"];
		if (contentType.search("text/html") < 0) {
			return false;
		}
		return true;
	};

	public static createAxiosInstanceWithSession = (cookieSession: string) => {
		const api = axios.create({ withCredentials: true });
		api.defaults.headers.Cookie = cookieSession;

		return api;
	};
}
