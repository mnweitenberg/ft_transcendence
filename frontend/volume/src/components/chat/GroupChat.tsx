import { useEffect, useState, useRef } from "react";
import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import GroupStats from "./GroupStats";
import { gql, useMutation, useQuery } from "@apollo/client";
import { convertEncodedImage } from "src/utils/convertEncodedImage";
import { renderSendContainer } from "./Chat";

const GET_CHANNEL = gql`
	query group_chat($channel_id: String!) {
		group_chat(id: $channel_id) {
			name
			logo
			messages {
				id
				content
				author {
					id
					username
					avatar {
						file
					}
				}
			}
			members {
				id
				username
				avatar {
					file
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
		group_message_sent(channel_id: $channel_id) {
			id
			content
			author {
				id
				username
				avatar {
					file
				}
			}
		}
	}
`;

const SEND_MESSAGE = gql`
	mutation sendMessage($channel_id: String!, $content: String!) {
		createGroupMessage(channel_id: $channel_id, content: $content) {
			id
		}
	}
`;

export default function GroupChat({
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
				const newMessage = subscriptionData.data.group_message_sent;
				return Object.assign({}, prev, {
					group_chat: {
						...prev.group_chat,
						messages: [...prev.group_chat.messages, newMessage],
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
			{renderHeader(data, renderOverview, props)};
			<Messages data={data} current_user={current_user} />;
			{renderSendContainer(message, handleMessageInput, sendMessage)}
		</div>
	);
}

function renderHeader(data: any, renderOverview: () => void, props: any) {
	return (
		<div className="chat_pm_header">
			<div className="go_back">
				<img className="arrow_back" src="/img/arrow_back.png" onClick={renderOverview} />
			</div>
			<div className="pm_user">
				<img className="pm_avatar" src={data.group_chat.logo} />
				<h3>{data.group_chat.name}</h3>
			</div>
			<div className="groupchat_info">
				<a
					className="link"
					onClick={() =>
						props.toggleModal(<GroupStats {...props} selectedGroup={data.group_chat} />)
					}
				>
					group stats
				</a>
			</div>
		</div>
	);
}

function Messages({ data, current_user }: { data: any; current_user: any }) {
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	useEffect(() => {
		scrollToBottom();
	}, [data.group_chat.messages]);
	return (
		<div className="messages_container">
			{data.group_chat.messages.map(function (message: any) {
				// TODO: use better type
				if (message.author.id === current_user.id)
					// TODO: use real author
					return (
						<div key={message.id} className="user">
							{message.content}
						</div>
					);
				return (
					<div key={message.id} className="friend">
						<div className="flexContainer">
							<div className="avatar_container">
								<img src={convertEncodedImage(message.author.avatar.file)} />
							</div>
							<div>
								<h3>{message.author.username}</h3>
								{message.content}{" "}
							</div>
						</div>
					</div>
				);
			})}
			<div ref={messagesEndRef} />
		</div>
	);
}
