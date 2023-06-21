import "../../styles/style.css";
import NewChat from "./JoinChannel";
import * as i from "../../types/Interfaces";
import { ChatState } from "../../utils/constants";
import { gql, useQuery } from "@apollo/client";
import { queryCurrentUser } from "src/utils/queryUser";
import { convertEncodedImage } from "src/utils/convertEncodedImage";

const GET_CHANNELS = gql`
	query GetChannels {
		currentUserQuery {
			personal_chats {
				id
				name
				logo
				lastMessage {
					content
				}
			}
			group_chats {
				id
				name
				logo
				lastMessage {
					content
				}
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

	function renderPersonalChat(channel_id: string) {
		setSelectedChannel(channel_id);
		setChatState(ChatState.personalMessage);
	}
	function renderGroupChat(channel_id: string) {
		setSelectedChannel(channel_id);
		setChatState(ChatState.groupMessage);
	}
	return (
		<>
			Personal Chats
			<br></br>
			{data.currentUserQuery.personal_chats.map((personal_chat: any) => {
				return (
					<div
						className="chat_container"
						key={personal_chat.id + "_key"}
						onClick={() => renderPersonalChat(personal_chat.id)}
					>
						<img className="avatar" src={personal_chat.logo} />
						<div className="wrap_name_message">
							<div className="flex_row_spacebetween">
								<h3 className="name">{personal_chat.name}</h3>
								<div className="status">{personal_chat.status}</div>
							</div>
							<div className="chat_preview">
								{personal_chat.lastMessage?.content ?? ""}
							</div>
						</div>
					</div>
				);
			})}
			<br></br>
			Group Chats
			<br></br>
			{data.currentUserQuery.group_chats.map((group_chat: any) => {
				return (
					<div
						className="chat_container"
						key={group_chat.id + "_key"}
						onClick={() => renderGroupChat(group_chat.id)}
					>
						<img className="avatar" src={group_chat.logo} />
						<div className="wrap_name_message">
							<div className="flex_row_spacebetween">
								<h3 className="name">{group_chat.name}</h3>
								<div className="status">{group_chat.status}</div>
							</div>
							<div className="chat_preview">
								{group_chat.lastMessage?.content ?? ""}
							</div>
						</div>
					</div>
				);
			})}
			<div className="new_chat flex_row_spacebetween">
				<a onClick={() => props.toggleModal(<PersonalChat />)}>new chat</a>
				<a onClick={() => props.toggleModal(<NewChat />)}>join channel</a>
				<a onClick={() => props.toggleModal(<CreateChannel />)}>create channel</a>
			</div>
		</>
	);
}

const GET_ALL_USERS = gql`
	query {
		allUsersQuery {
			username
		}
	}
`;

// const GET_ALL_USERS = gql`
// 	query {
// 		allUsersQuery {
// 			username
// 			avater {
// 				file
// 			}
// 		}
// 	}
// `;

function PersonalChat() {
	const { loading, data, error } = useQuery(GET_ALL_USERS);
	if (error) return <p>Error</p>;
	if (loading) return <p>Loading...</p>;
	return (
		<div className="new_chat">
			{data.allUsersQuery.map(function (user: any) {
				return (
					<div key={user.username} className="selectUser">
						{/* <img className="avatar" src={convertEncodedImage(user?.avatar.file)} /> */}
						<button onClick={() => CreateNewChat(user)}>
							Send message to {user.username}
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
	const username = queryCurrentUser().username;
	console.log(username);
}

export default Overview;
