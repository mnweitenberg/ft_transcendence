import { UserInfo } from "src/auth/user-info.interface";
import { GraphQLContext } from "./graphql-context";

export function getSubscriptionUser({req: {extra: {request: {user}}}}: GraphQLContext): UserInfo {
	return user;
}