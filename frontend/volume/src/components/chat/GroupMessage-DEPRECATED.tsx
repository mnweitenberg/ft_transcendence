// import { useState } from "react";
// import "../../styles/style.css";
// import * as i from "../../types/Interfaces";
// import { chats, user } from "../../utils/data";
// import { getChatsByUser } from "../../utils/utils";
// import { createLeaveGroupChatAlert } from "../../utils/utils";
// import GroupStats from "./GroupStats";

// export default function GroupMessage({
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
// 				<div className="groupchat_info">
// 					<a
// 						className="link"
// 						onClick={() =>
// 							props.toggleModal(props.selectedUser, <GroupStats {...props} />)
// 						}
// 					>
// 						group stats
// 					</a>
// 					<a
// 						className="link"
// 						onClick={() =>
// 							props.toggleModal(props.selectedUser, createLeaveGroupChatAlert(props))
// 						}
// 					>
// 						leave group
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
// 							<>
// 								<div key={chat.id} className="friend">
// 									<div className="flexContainer">
// 										<img className="avatar" src={chat.sender.avatar} />
// 										<div>
// 											<h3>{chat.sender.name}</h3>
// 											{chat.message}{" "}
// 										</div>
// 									</div>
// 								</div>
// 							</>
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
