// import { useState } from "react";
// import "../../styles/style.css";
// import * as i from "../../types/Interfaces";
// import { chats, user } from "../../utils/data";
// import { getChatsByUser } from "../../utils/utils";
// import { createChallengeAlert, createBlockAlert } from "../../utils/utils";
// import UserStats from "../common/UserStats";

// // https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/

// export default function PersonalMessage({
// 	props,
// 	renderOverview,
// }: {
// 	props: i.ModalProps;
// 	renderOverview: () => void;
// }) {
// 	const handleMessageInput = (e: any) => {
// 		setMessage(e.target.value);
// 	};

// 	function sendMessage(): void {
// 		const newMessage: i.Chat = {
// 			id: chats.length,
// 			message: message,
// 			sender: user,
// 			reciever: props.selectedUser,
// 		};
// 		chats.push(newMessage);
// 		setMessage("");
// 	}

// 	const [message, setMessage] = useState("");

// 	window.onkeydown = function (e) {
// 		if (e.key === "Enter" && message !== "") sendMessage();
// 	};

// 	const chatsWithFriend = getChatsByUser(chats, props.selectedUser);
// 	return (
// 		<div className="personalMessage">
// 			<div className="chat_pm_header">
// 				<div className="go_back">
// 					<img
// 						className="arrow_back"
// 						src="/img/arrow_back.png"
// 						onClick={renderOverview}
// 					/>
// 				</div>
// 				<div className="pm_user">
// 					<img className="pm_avatar" src={props.selectedUser.avatar} />
// 					<h3>{props.selectedUser.name}</h3>
// 				</div>
// 				<div className="pm_info">
// 					<a
// 						className="link"
// 						onClick={() =>
// 							props.toggleModal(props.selectedUser, createChallengeAlert(props))
// 						}
// 					>
// 						challenge
// 					</a>
// 					<a
// 						className="link"
// 						onClick={() =>
// 							props.toggleModal(props.selectedUser, <UserStats {...props} />)
// 						}
// 					>
// 						stats
// 					</a>
// 					<a
// 						className="link"
// 						onClick={() =>
// 							props.toggleModal(props.selectedUser, createBlockAlert(props))
// 						}
// 					>
// 						block
// 					</a>
// 				</div>
// 			</div>

// 			<div className="messages_container">
// 				{chatsWithFriend &&
// 					chatsWithFriend.map(function (chat) {
// 						if (chat.sender === user)
// 							return (
// 								<div key={chat.id} className="user">
// 									{" "}
// 									{chat.message}{" "}
// 								</div>
// 							);
// 						return (
// 							<div key={chat.id} className="friend">
// 								{" "}
// 								{chat.message}{" "}
// 							</div>
// 						);
// 					})}
// 			</div>

// 			<div className="send_container">
// 				<input
// 					type="text"
// 					className="input_message"
// 					value={message}
// 					onChange={handleMessageInput}
// 				/>
// 				<img className="send_icon" src="/img/send.png" onClick={sendMessage} />
// 			</div>
// 		</div>
// 	);
// }
