import { useEffect, useState } from "react";
import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import { user } from "../../utils/data";
import { createLeaveGroupChatAlert } from "../../utils/utils";
import GroupStats from "./GroupStats";
import { gql, useMutation, useQuery } from '@apollo/client';

const GET_CHANNEL = gql`
	query getChannel($channel_id: String!) {
		getChannel(id: $channel_id) {
			name
			logo
			messages {
				id
				content
				author {
					username
				}
			}
		}
	}
`;

const SUBSCRIBE_MESSAGES = gql`
	subscription messageSent($channel_id: String!) {
		messageSent(channel_id: $channel_id) {
			id
			content
			author {
				username
			}
		}
	}
`;

const SEND_MESSAGE = gql`
	mutation sendMessage($channel_id: String!, $content: String!, $author_id: String!) { # TODO: do something better than author_id
		createMessage(channel_id: $channel_id, content: $content, author_id: $author_id) {
			id
		}
	}
`;

export default function NewGroupMessage({
	props,
	channel_id,
	renderOverview,
}: {
	props: i.ModalProps;
	channel_id: string;
	renderOverview: () => void;
}) {
	let { loading, data, error, subscribeToMore } = useQuery(GET_CHANNEL, {
		variables: { channel_id: channel_id },
	}); // FIXME: If a user is in the channel overview and a new message is sent, the user will not see the new message until he reloads the page
	let [sendMessageMutation] = useMutation(SEND_MESSAGE);

	useEffect(() => {
		return subscribeToMore({
			document: SUBSCRIBE_MESSAGES,
			variables: { channel_id: channel_id },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newMessage = subscriptionData.data.messageSent;
				return Object.assign({}, prev, {
					getChannel: {
						...prev.getChannel,
						messages: [...prev.getChannel.messages, newMessage],
					},
				});
			},
		});
	}, []);



	const handleMessageInput = (e: any) => {
		setMessage(e.target.value);
	};

	function sendMessage(): void {
		sendMessageMutation({ variables: { content: message, channel_id, author_id: "d0515269-d76c-44ff-b518-25b9fcf67571" } });
		setMessage("");
	}

	const [message, setMessage] = useState("");

	window.onkeydown = function (e) {
		if (e.key === "Enter" && message !== "") sendMessage();
	};

	if (error) return <p>Error</p>;
	if (loading) return <p>Loading...</p>;

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
					<img className="pm_avatar" src={data.getChannel.logo} />
					<h3>{data.getChannel.name}</h3>
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
				{data.getChannel.messages.map(function (message: any) { // TODO: use better type
						if (message.author === user) // TODO: use real author
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