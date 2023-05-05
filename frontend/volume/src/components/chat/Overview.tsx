import "../../styles/style.css";
import NewChat from "./JoinChannel";
import { user, chats, allUsers } from "../../utils/data";
import * as i from "../../types/Interfaces";
import { getChatsByUser } from "../../utils/utils";
import { ChatState } from "../../utils/constants";
import { gql, useQuery } from "@apollo/client";

const GET_CHANNELS = gql`
	query GetChannels {
		allChannels {
			id
			name
			logo
			lastMessage {
				content
			}
		}
	}
`;

function Overview({
	props,
	setSelectedChannel,
	setChatState,
}: {
	props: i.ModalProps;
	setSelectedChannel: (channel_id: string) => void;
	setChatState: (state: ChatState) => void;
}) {
	const { loading, data, error } = useQuery(GET_CHANNELS, {
		fetchPolicy: "network-only", // TODO: Is this the best way to do this?
	});
	if (error) return <p>Error</p>;
	if (loading) return <p>Loading...</p>;

	// function renderPersonalMessage(friend: i.User) {
	// 	props.setSelectedUser(friend);
	// 	setChatState(ChatState.personalMessage);
	// } // TODO: Add Personal Messages
	function renderGroupMessage(channel_id: string) {
		setSelectedChannel(channel_id);
		setChatState(ChatState.groupMessage);
	}
	return (
		<>
			{data.allChannels.map((channel: any) => {
				return (
					<div
						className="chat_container"
						key={channel.id + "_key"}
						onClick={() => renderGroupMessage(channel.id)}
					>
						<img className="avatar" src={channel.logo} />
						<div className="wrap_name_message">
							<div className="flex_row_spacebetween">
								<h3 className="name">{channel.name}</h3>
								<div className="status">{channel.status}</div>
							</div>
							<div className="chat_preview">{channel.lastMessage?.content ?? ""}</div>
						</div>
					</div>
				);
			})}
		</>
	);
}

function PersonalChat() {
	return (
		<div className="new_chat">
			{allUsers.map(function (user: any) {
				return (
					<div key={user.name} className="selectUser">
						<img className="avatar" src={user.avatar} />
						<button onClick={() => CreateNewChat(user)}>
							Send message to {user.name}
						</button>
					</div>
				);
			})}
		</div>
	);
}

function CreateChannel() {
	return (
		<div className="new_chat">
			<form>
				<h3>Name</h3>
				<input type="text" placeholder=""></input>
				<h3>Password</h3>
				<input type="text" placeholder="leave blank to create public channel"></input>
				<button>Create channel</button>
			</form>
		</div>
	);
}

function CreateNewChat(user: i.User) {
	console.log(user.name);
}

export default Overview;
