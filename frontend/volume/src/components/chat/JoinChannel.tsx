import "../../styles/style.css";
import { useState } from "react";
import * as i from "../../types/Interfaces";
import PrivateChannel from "./JoinPrivate";
import PublicChannel from "./JoinPublic";

export default function JoinChannel(props: i.ModalProps & { refetchChannels: () => void }) {
	const [toggleChannel, setToggleChannel] = useState(false);

	return (
		<div className="new_chat">
			<div className="flex_row_spacebetween">
				<a
					style={toggleChannel ? {} : { fontWeight: "bold" }}
					onClick={() => setToggleChannel(false)}
				>
					public channels
				</a>
				<a
					style={toggleChannel ? { fontWeight: "bold" } : {}}
					onClick={() => setToggleChannel(true)}
				>
					private channels
				</a>
			</div>
			{toggleChannel ? (
				<PrivateChannel />
			) : (
				<PublicChannel
					setShowModal={props.setShowModal}
					refetchChannels={props.refetchChannels}
				/>
			)}
		</div>
	);
}
