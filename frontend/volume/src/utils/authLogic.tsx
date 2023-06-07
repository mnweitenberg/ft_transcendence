import { useState, createContext, useContext, useEffect } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const LOGOUT_MUTATION = gql`
	mutation logoutMutation {
		logoutMutation
	}
`;

export interface IContextProps {
	onLogout: () => Promise<void>;
}

export const AuthContext = createContext({} as IContextProps);

export function AuthProvider({ children }: { children: any }): JSX.Element {
	// const [login, setLogin] = useState(false);
	const [logoutMutation, { loading, error, data }] = useMutation(LOGOUT_MUTATION);
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logoutMutation();
		navigate("/login");
	};
	const value: IContextProps = {
		onLogout: handleLogout,
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	return useContext(AuthContext);
}
