export enum TokenType {
	FULL = "FULL",
	PARTIAL = "PARTIAL",
}

export interface UserInfo {
	intraId: string;
	userUid: string;
	type: TokenType;
}
