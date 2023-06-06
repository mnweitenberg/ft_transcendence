import { useEffect, useState } from "react";
import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import { user } from "../../utils/data";
import { createLeaveGroupChatAlert } from "../../utils/utils";
import GroupStats from "./GroupStats";
import { gql, useMutation, useQuery } from "@apollo/client";

const GET_CHANNEL = gql`
	query personal_chat($channel_id: String!) {
		personal_chat(id: $channel_id) {
			name
			logo
			messages {
				id
				content
				author {
					id
					username
				}
			}
		}
		currentUserQuery {
			id
		}
	}
`;

const SUBSCRIBE_MESSAGES = gql`
	subscription messageSent($channel_id: String!) {
		personal_message_sent(channel_id: $channel_id) {
			id
			content
			author {
				id
				username
			}
		}
	}
`;

const SEND_MESSAGE = gql`
	mutation sendMessage($channel_id: String!, $content: String!) {
		# TODO: do something better than author_id
		createPersonalMessage(channel_id: $channel_id, content: $content) {
			id
		}
	}
`;

export default function PersonalChat({
	props,
	channel_id,
	renderOverview,
}: {
	props: i.ModalProps;
	channel_id: string;
	renderOverview: () => void;
}) {
	const { loading, data, error, subscribeToMore } = useQuery(GET_CHANNEL, {
		variables: { channel_id: channel_id },
	}); // FIXME: If a user is in the channel overview and a new message is sent, the user will not see the new message until he reloads the page
	const [sendMessageMutation] = useMutation(SEND_MESSAGE);

	useEffect(() => {
		return subscribeToMore({
			document: SUBSCRIBE_MESSAGES,
			variables: { channel_id: channel_id },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newMessage = subscriptionData.data.personal_message_sent;
				return Object.assign({}, prev, {
					personal_chat: {
						...prev.personal_chat,
						messages: [...prev.personal_chat.messages, newMessage],
					},
				});
			},
		});
	}, []);

	const handleMessageInput = (e: any) => {
		setMessage(e.target.value);
	};

	function sendMessage(): void {
		sendMessageMutation({
			variables: {
				content: message,
				channel_id,
			},
		});
		setMessage("");
	}

	const [message, setMessage] = useState("");

	window.onkeydown = function (e) {
		if (e.key === "Enter" && message !== "") sendMessage();
	};

	if (error) return <p>Error</p>;
	if (loading) return <p>Loading...</p>;

	const current_user = data.currentUserQuery;

	return (
		<div className="personalMessage">
			<div className="chat_pm_header">
				<div className="go_back">
					<img
						className="arrow_back"
						src="/img/arrow_back.png"
						onClick={renderOverview}
					/>
				</div>
				<div className="pm_user">
					<img className="pm_avatar" src={data.personal_chat.logo} />
					<h3>{data.personal_chat.name}</h3>
				</div>
				<div className="groupchat_info">
					<a
						className="link"
						onClick={() =>
							props.toggleModal(props.selectedUser, <GroupStats {...props} />)
						}
					>
						group stats
					</a>
					<a
						className="link"
						onClick={() =>
							props.toggleModal(props.selectedUser, createLeaveGroupChatAlert(props))
						}
					>
						leave group
					</a>
				</div>
			</div>

			<div className="messages_container">
				{data.personal_chat.messages.map(function (message: any) {
					// TODO: use better type
					if (message.author.id === current_user.id)
						// TODO: use real author
						return (
							<div key={message.id} className="user">
								{" "}
								{message.content}{" "}
							</div>
						);
					return (
						<div key={message.id} className="friend">
							<div className="flexContainer">
								<img className="avatar" src={message.author.avatar} />
								<div>
									<h3>{message.author.username}</h3>
									{message.content}{" "}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className="send_container">
				<input
					type="text"
					className="input_message"
					value={message}
					onChange={handleMessageInput}
				/>
				<img className="send_icon" src="/img/send.png" onClick={sendMessage} />
			</div>
		</div>
	);
}
