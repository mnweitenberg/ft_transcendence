import { gql, useQuery, useMutation } from "@apollo/client";
import { convertEncodedImage } from "../../utils/convertEncodedImage";

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
export default function NewChat({
	setShowModal,
	refetchChannels,
}: {
	setShowModal: (showModal: boolean) => void;
	refetchChannels: () => void;
}) {
	const { loading, data, error, refetch } = useQuery(GET_ALL_CHATS, {
		fetchPolicy: "network-only",
	});

	const [createPersonalChat, { loading: joinLoading, error: joinError }] =
		useMutation(CREATE_PERSONAL_CHAT);

	async function CreateChat(userId: string) {
		console.log("userId", userId);
		try {
			await createPersonalChat({
				variables: { userId: userId },
			});
			refetch();
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
