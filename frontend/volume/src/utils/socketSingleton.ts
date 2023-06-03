import { io } from "socket.io-client";

class SocketSingleton {
	private static instance: SocketSingleton;
	public socket: any;

	private constructor() {
		this.socket = io("http://localhost:4242", {
			withCredentials: true,
			// extraHeaders: {authorization: "Bearer <token>",},
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

// export default SocketSingleton;

// import { io } from "socket.io-client";

// class SocketSingleton {
// 	private static instance: SocketSingleton;
// 	public socket: any;

// 	private constructor(token: string) {
// 		this.socket = io("http://localhost:4242", {
// 			query: { token: token },
// 		});
// 		this.socket.on("connect_error", (error: any) => {
// 			console.error(error);
// 		});
// 	}
// 	public static getInstance(token: string): SocketSingleton {
// 		if (!SocketSingleton.instance) {
// 			SocketSingleton.instance = new SocketSingleton(token);
// 		}
// 		return SocketSingleton.instance;
// 	}
// }

// export default SocketSingleton;
