import "../../styles/style.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import * as i from "../../types/Interfaces";

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

function PrivateChannel() {
	return (
		<div id="new_chat">
			<h2>TO DO: list of public channels</h2>
			{/* {privateChannels.map(function (channel: any) {
				return (
					<div key={channel.name} className="selectUser">
						<img className="avatar" src={channel.avatar} />
						<button onClick={() => Join(channel.name)}>
							{channel.name}
							<h5>
								created by {channel.creator.name}, {channel.members.length} members
							</h5>
						</button>
					</div>
				);
			})} */}
		</div>
	);
}

const GET_ALL_PUBLIC_CHANNELS = gql`
	query {
		all_available_public_channels {
			id
			name
			logo
			members {
				username
			}
		}
	}
`;

const JOIN_GROUP_CHAT = gql`
	mutation JoinGroupChat($channelId: String!) {
		joinGroupChat(channelId: $channelId) {
			id
			name
			logo
			members {
				username
			}
		}
	}
`;

function PublicChannel({
	setShowModal,
	refetchChannels,
}: {
	setShowModal: (showModal: boolean) => void;
	refetchChannels: () => void;
}) {
	const { loading, data, error } = useQuery(GET_ALL_PUBLIC_CHANNELS);
	const [joinGroupChat, { loading: joinLoading, error: joinError }] =
		useMutation(JOIN_GROUP_CHAT);

	async function Join(channelId: string) {
		try {
			await joinGroupChat({
				variables: { channelId: channelId },
			});
			refetchChannels();
			setShowModal(false);
		} catch (error) {
			console.log("Error joining ", error);
		}
	}

	if (data && data.all_available_public_channels.length === 0) return <p>No channels to join</p>;
	if (joinError) return <p>Error: {joinError.message}</p>;
	if (joinLoading) return <p>Joining...</p>;

	if (error) return <p>Error</p>;
	if (loading) return <p>Loading...</p>;

	return (
		<div className="new_chat">
			{data.all_available_public_channels.map(function (chat: any) {
				return (
					<div key={chat.id} className="selectUser">
						<img className="avatar" src={chat.logo} />
						<button onClick={() => Join(chat.id)}>Join {chat.name}</button>
					</div>
				);
			})}
		</div>
	);
}
