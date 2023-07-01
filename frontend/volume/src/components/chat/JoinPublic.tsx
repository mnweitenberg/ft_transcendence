import "../../styles/style.css";
import { gql, useMutation, useQuery } from "@apollo/client";

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

export default function PublicChannel({
	setShowModal,
	refetchChannels,
}: {
	setShowModal: (showModal: boolean) => void;
	refetchChannels: () => void;
}) {
	const { loading, data, error, refetch } = useQuery(GET_ALL_PUBLIC_CHANNELS);
	const [joinGroupChat, { loading: joinLoading, error: joinError }] =
		useMutation(JOIN_GROUP_CHAT);

	async function Join(channelId: string) {
		try {
			await joinGroupChat({
				variables: { channelId: channelId },
			});
			refetch();
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
