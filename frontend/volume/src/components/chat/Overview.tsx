import "../../styles/style.css";
import NewChat from "./NewChat";
import { user, chats } from "../../utils/data";
import * as i from "../../types/Interfaces";
import { getChatsByUser } from "../../utils/utils";
import { ChatState } from "../../utils/constants";

// https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/

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

			<div className="new_chat">
				<a onClick={() => props.toggleModal(null, <NewChat />)}>new chat</a>
			</div>
		</>
	);
}

export default Overview;
