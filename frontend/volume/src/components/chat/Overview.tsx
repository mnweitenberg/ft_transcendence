import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import { ChatState } from "../../utils/constants";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import JoinChannel from "./JoinChannel";
import CreateChannel from "./CreateChannel";
import { useEffect } from "react";

const GET_CHANNELS = gql`
	query GetChannels {
		currentUserQuery {
			personal_chats {
				id
				name
				logo
				lastMessage {
					content
					dateSent
				}
				members {
					id
					username
					avatar {
						file
					}
				}
			}
			group_chats {
				id
				name
				logo
				lastMessage {
					content
					dateSent
				}
				isPublic
				members {
					id
					username
					avatar {
						file
					}
				}
			}
		}
	}
`;

// const MESSAGE_SUBSCRIPTION = gql`
// 	subscription group_message_sent {
// 		group_message_sent {
// 			id
// 			content
// 			dateSent
// 		}
// 	}
// `;

function Overview({
	props,
	setSelectedChannel,
	setChatState,
}: {
	props: i.ModalProps;
	setSelectedChannel: (channel_id: string) => void;
	setChatState: (state: ChatState) => void;
}) {
	// const { data: newMessageData } = useSubscription(MESSAGE_SUBSCRIPTION);
	const { loading, error, data, refetch } = useQuery(GET_CHANNELS);

	const refetchChannels = () => {
		refetch();
	};

	if (error) return <p>Error: {error.message}</p>;
	if (loading) return <p>Loading...</p>;

	function renderChat(channel_id: string, isPublic?: boolean) {
		setSelectedChannel(channel_id);
		if (isPublic === undefined) setChatState(ChatState.personalMessage);
		else setChatState(ChatState.groupMessage);
	}

	// merge personal and group chats
	let allChats = data.currentUserQuery.personal_chats.concat(data.currentUserQuery.group_chats);

	// if chat has no name, use the other user's name
	allChats = allChats.map((chat: any) => {
		const newChat = { ...chat };
		if (!newChat.name) {
			newChat.name =
				props.userId === newChat.members[0]
					? newChat.members[0].username
					: newChat.members[1].username;
		}
		if (!newChat.logo) {
			newChat.logo =
				props.userId === newChat.members[0]
					? newChat.members[0].avatar.file
					: newChat.members[1].avatar.file;
		}
		return newChat;
	});

	// TO DO is not working
	// sort by dateSent
	allChats.sort(function (a: any, b: any) {
		if (a.lastMessage?.dateSent && b.lastMessage?.dateSent) {
			Date.parse(b.lastMessage.dateSent) - Date.parse(a.lastMessage.dateSent);
		}
	});

	return (
		<>
			<div className="overview_wrapper">
				{allChats.map((chat: any) => {
					return (
						<div
							className="chat_container"
							key={chat.id + "_key"}
							onClick={() => renderChat(chat.id, chat.isPublic)}
						>
							<div className="avatar_container">
								<img src={convertEncodedImage(chat.logo)}></img>
							</div>
							<div className="wrap_name_message">
								<div className="flex_row_spacebetween">
									<h3 className="name">{chat.name}</h3>
									<div className="status">{chat.status}</div>
								</div>
								<div className="chat_preview">
									{chat.lastMessage?.content ?? ""}
								</div>
							</div>
						</div>
					);
				})}
			</div>
			{renderNewChatOptions({ props, refetchChannels })}
		</>
	);
}

function renderNewChatOptions({
	props,
	refetchChannels,
}: {
	props: i.ModalProps;
	refetchChannels: () => void;
}) {
	return (
		<div className="new_chat flex_row_spacebetween">
			<a
				onClick={() =>
					props.toggleModal(
						<NewChat
							setShowModal={props.setShowModal}
							refetchChannels={refetchChannels}
						/>
					)
				}
			>
				new chat
			</a>
			<a
				onClick={() =>
					props.toggleModal(<JoinChannel {...props} refetchChannels={refetchChannels} />)
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
	);
}

const GET_ALL_CHATS = gql`
	query {
		all_available_personal_chats {
			username
			id
			avatar {
				file
			}
		}
	}
`;

const CREATE_PERSONAL_CHAT = gql`
	mutation CreatePersonalChat($userId: String!) {
		createPersonalChat(userId: $userId) {
			id
			members {
				id
			}
		}
	}
`;

// TODO: Make avatars work
function NewChat({
	setShowModal,
	refetchChannels,
}: {
	setShowModal: (showModal: boolean) => void;
	refetchChannels: () => void;
}) {
	const { loading, data, error } = useQuery(GET_ALL_CHATS);

	const [createPersonalChat, { loading: joinLoading, error: joinError }] =
		useMutation(CREATE_PERSONAL_CHAT);

	async function CreateChat(userId: string) {
		console.log("userId", userId);
		try {
			await createPersonalChat({
				variables: { userId: userId },
			});
			refetchChannels();
			setShowModal(false);
		} catch (error) {
			console.log("Error joining ", error);
		}
	}

	if (data && data.all_available_personal_chats.length === 0)
		return <p>You're already chatting with all possible users</p>;
	if (joinError) return <p>Error: {joinError.message}</p>;
	if (joinLoading) return <p>Joining...</p>;

	if (error) return <p>Error {error.message}</p>;
	if (loading) return <p>Loading...</p>;
	return (
		<div className="new_chat">
			{data.all_available_personal_chats.map(function (user: any) {
				return (
					<div key={user.username} className="selectUser">
						<div className="avatar_container">
							<img src={convertEncodedImage(user.avatar.file)} />
						</div>
						<button onClick={() => CreateChat(user.id)}>
							Send message to {user.username}
						</button>
					</div>
				);
			})}
		</div>
	);
}

export default Overview;
