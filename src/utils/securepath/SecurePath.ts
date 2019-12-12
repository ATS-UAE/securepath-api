import axios from "axios";
import md5 from "md5-hex";
import {
	TrackerManagement,
	Live,
	UserManagement,
	CredentialsException,
	AuthNeededException,
	Api
} from ".";
import { stringifyQuery } from "..";

export class SecurePath extends Api {
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

	get authCookie(): string {
		return this.api.defaults.headers.Cookie;
	}

	get TrackerManagement() {
		return new TrackerManagement(this.api);
	}

	get UserManagement() {
		return new UserManagement(this.api);
	}

	get Live() {
		return new Live(this.api);
	}
}
