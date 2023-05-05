import { Injectable } from '@nestjs/common';
import { Session, SessionStatus } from './Session';

@Injectable()
export class SessionService {
	constructor() {
		console.log('SessionService constructor');
	}

	private _sessionList: Session[] = [];

	findSession(tokenToMatch: string): Session {
		for (let i of this.sessionList) {
			if (i.access_token == tokenToMatch) return i;
		}
		return null;
	}
	addSession(tokenForSession: string): void {
		// let newSession();
		// this.sessionList.push()
	}

	// Functions that other parts of the code use
	get sessionList() {
		return this._sessionList;
	}
}

//
// Which user is tied to the session?
// UID should be used for searching/queries internally
//

// which data must be passed to the browser/client for us to identify them?
