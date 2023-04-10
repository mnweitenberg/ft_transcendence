import "../../styles/style.css";
import NewChat from "./JoinChannel";
import { user, chats, allUsers } from "../../utils/data";
import * as i from "../../types/Interfaces";
import { getChatsByUser } from "../../utils/utils";
import { ChatState } from "../../utils/constants";

function Overview({
	props,
	setChatState,
}: {
	props: i.ModalProps;
	setChatState: (state: ChatState) => void;
}) {
	function renderPersonalMessage(friend: i.User) {
		props.setSelectedUser(friend);
		setChatState(ChatState.personalMessage);
	}
	function renderGroupMessage(friend: i.User) {
		props.setSelectedUser(friend);
		setChatState(ChatState.groupMessage);
	}
	return (
		<>
			{user.friends &&
				user.friends.map(function (friend) {
					return (
						<div
							className="chat_container"
							key={friend.name + "_key"}
							onClick={() => renderPersonalMessage(friend)}
						>
							<img className="avatar" src={friend.avatar} />
							<div className="wrap_name_message">
								<div className="flex_row_spacebetween">
									<h3 className="name">{friend.name}</h3>
									<div className="status">{friend.status}</div>
								</div>
								<div className="chat_preview">
									{getChatsByUser(chats, friend) &&
										getChatsByUser(chats, friend).at(-1)?.message}
								</div>
							</div>
						</div>
					);
				})}

			<div
				className="chat_container"
				key={"groupchat"}
				onClick={() => renderGroupMessage(user)}
			>
				<img className="avatar" src="/img/milan2.png" />
				<div className="wrap_name_message">
					<div className="flex_row_spacebetween">
						<h3 className="name">Crzy Groupchat</h3>
						<div className="status"></div>
					</div>
					<div className="chat_preview">
						{/* {getChatsByUser(chats, friend) &&
							getChatsByUser(chats, friend).at(-1)?.message} */}
					</div>
				</div>
			</div>

			<div className="new_chat flex_row_spacebetween">
				<a onClick={() => props.toggleModal(null, <PersonalChat />)}>new chat</a>
				<a onClick={() => props.toggleModal(null, <NewChat />)}>join channel</a>
				<a onClick={() => props.toggleModal(null, <CreateChannel />)}>create channel</a>
			</div>
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
