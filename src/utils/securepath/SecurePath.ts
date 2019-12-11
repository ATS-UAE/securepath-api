import axios, { AxiosInstance, AxiosResponse } from "axios";
import md5 from "md5-hex";
import { TrackerManagement } from "..";
import { stringifyQuery } from "..";
import { CredentialsException } from "./exceptions/CredentialsException";
import { AuthNeededException } from "./exceptions/AuthNeededException";

export class SecurePath {
	public static login = async (username: string, password: string) => {
		const api = axios.create({ withCredentials: true });

		const seed = await api(
			"http://securepath.atsuae.net/php/getpage.php?mode=login&fx=getSeed",
			{
				method: "post",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}
		);

		api.defaults.headers.Cookie = seed.headers["set-cookie"][0];

		const hash = md5(password + seed.data);

		const queryString = stringifyQuery({
			uname: username,
			hash,
			tz: "Asia/Dubai",
			language: "en"
		});

		await api.post(
			"http://securepath.atsuae.net/php/getpage.php?mode=login&fx=authenticate",
			queryString,
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}
		);

		const sp = new SecurePath(api);

		try {
			await sp.checkLogin();
		} catch (e) {
			if (e instanceof AuthNeededException) {
				throw new CredentialsException();
			}
			throw new Error("Unknown error");
		}

		return sp;
	};

	public static useCookie = async (cookie: string) => {
		const api = axios.create({ withCredentials: true });
		api.defaults.headers.Cookie = cookie;
		const sp = new SecurePath(api);

		try {
			await sp.checkLogin();
		} catch (e) {
			if (e instanceof AuthNeededException) {
				throw new CredentialsException();
			}
			throw new Error("Unknown error");
		}

		return sp;
	};

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

	protected constructor(protected api: AxiosInstance) {}

	public checkLogin = async () => {
		const isLoggedIn = await this.api.get(
			"http://securepath.atsuae.net/php/getpage.php?mode=admin&fx=display"
		);

		if (SecurePath.isSecurepathForbidden(isLoggedIn)) {
			throw new CredentialsException();
		}
	};

	get authCookie(): string {
		return this.api.defaults.headers.Cookie;
	}

	get TrackerManagement() {
		return new TrackerManagement(this.api);
	}
}
