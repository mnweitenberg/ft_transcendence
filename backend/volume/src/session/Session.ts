export enum SessionStatus {
	Idle = 0,
	InGame,
	InQueue,
}

export class Session {
	private _clientId;
	private _username: string;
	private _access_token: string;
	private _status: number;

	constructor(
		usernameArg: string,
		access_tokenArg: string,
		statusArg: number,
	) {
		this._username = usernameArg;
		this._access_token = access_tokenArg;
		this._status = statusArg;
	}

	get username() {
		return this._username;
	}
	get access_token() {
		return this._access_token;
	}
	get status() {
		return this._status;
	}
	set status(newStatus: number) {
		this._status = newStatus;
	}
}
