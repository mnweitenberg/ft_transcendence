import { io } from "socket.io-client";

class SocketSingleton {
	private static instance: SocketSingleton;
	public socket: any;

	private constructor() {
		this.socket = io("http://localhost:4243");
	}

	public static getInstance(): SocketSingleton {
		if (!SocketSingleton.instance) {
			SocketSingleton.instance = new SocketSingleton();
		}
		return SocketSingleton.instance;
	}
}

export default SocketSingleton;
