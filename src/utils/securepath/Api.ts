import { AxiosInstance, AxiosResponse } from "axios";
import { AuthNeededException } from ".";

export interface ApiOptions {
	baseUrl: string;
}
export abstract class Api {
	protected static isSecurepathForbidden = (
		response: AxiosResponse
	): boolean => {
		if (
			typeof response.data === "string" &&
			response.data.search("Redirecting to login page .. Please wait") > 0
		) {
			return true;
		}
		try {
			JSON.stringify(response.data);
			return false;
		} catch (e) {
			return true;
		}
	};

	protected constructor(
		public api: AxiosInstance,
		public options: ApiOptions
	) {}

	public checkLogin = async () => {
		const isLoggedIn = await this.api.get(
			`${this.options.baseUrl}/php/getpage.php?mode=admin&fx=display`
		);

		if (Api.isSecurepathForbidden(isLoggedIn)) {
			throw new AuthNeededException();
		}
	};
}
