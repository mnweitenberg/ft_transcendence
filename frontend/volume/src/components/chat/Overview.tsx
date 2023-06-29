import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import { ChatState } from "../../utils/constants";
import { gql, useQuery } from "@apollo/client";
import { queryCurrentUser } from "src/utils/queryUser";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import JoinChannel from "./JoinChannel";
import CreateChannel from "./CreateChannel";

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
	const { loading, error, data, refetch } = useQuery(GET_CHANNELS);

	const refetchChannels = () => {
		refetch();
	};

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
				<a
					onClick={() =>
						props.toggleModal(
							<JoinChannel {...props} refetchChannels={refetchChannels} />
						)
					}
				>
					join channel
				</a>
				<a
					onClick={() =>
						props.toggleModal(
							<CreateChannel {...props} refetchChannels={refetchChannels} />
						)
					}
				>
					create channel
				</a>
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

// TODO: Make avatars work
function PersonalChat() {
	const { loading, data, error } = useQuery(GET_ALL_USERS);
	if (error) return <p>Error</p>;
	if (loading) return <p>Loading...</p>;
	return (
		<div className="new_chat">
			{data.allUsersQuery.map(function (user: any) {
				return (
					<div key={user.username} className="selectUser">
						<div className="avatar_container">
							<img src={convertEncodedImage(user?.avatar.file)} />
						</div>
						<button onClick={() => CreateNewPersonalChannel(user)}>
							Send message to {user.username}
						</button>
					</div>
				);
			})}
		</div>
	);
}

function CreateNewPersonalChannel(user: i.User) {
	console.log(user.username);
}

export default Overview;
