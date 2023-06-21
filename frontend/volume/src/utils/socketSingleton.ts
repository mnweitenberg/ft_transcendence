import { io } from "socket.io-client";

class SocketSingleton {
	private static instance: SocketSingleton;
	public socket: any;

	private constructor() {
		this.socket = io(`https://${import.meta.env["VITE_DOMAIN"]}`, {
			path: "/api/socket.io",
			withCredentials: true,
		});

		this.socket.on("connect", () => {
			console.log("Successfully connected to the server!");
		});
		this.socket.on("connect_error", (error: any) => {
			console.error(error);
		});
	}
	public static getInstance(): SocketSingleton {
		if (!SocketSingleton.instance) {
			SocketSingleton.instance = new SocketSingleton();
		}
		return SocketSingleton.instance;
	}
}

export default SocketSingleton;
