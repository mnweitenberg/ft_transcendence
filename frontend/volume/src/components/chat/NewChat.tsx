import "../../styles/style.css";
import { allUsers } from "../../utils/data";
import * as i from "../../types/Interfaces";

export default function NewChat() {
	// const [chatState, setChatState] = useState(ChatState.overview);

	return (
		<div className="new_chat">
			<div className="flex_row_spacebetween">
				<a onClick={() => showDiv("personal")}>create private chat</a>
				<a onClick={() => showDiv("group")}>create group chat</a>
			</div>

			<PersonalChat />
			<GroupChat />
		</div>
	);
}

function showDiv(div: string) {
	const group = document.getElementById("groupChat");
	const personal = document.getElementById("personalChat");

	if (!group || !personal) return;

	if (div === "personal") {
		group.style.display = "none";
		personal.style.display = "block";
	}
	if (div === "group") {
		personal.style.display = "none";
		group.style.display = "block";
	}
}

function PersonalChat() {
	return (
		<div id="personalChat">
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

function GroupChat() {
	return (
		<div id="groupChat">
			<form>
				<h3>Name</h3>
				<input type="text" placeholder=""></input>
				<h3>Password</h3>
				<input type="text" placeholder="leave blank to create open channel"></input>
				<button>Create channel</button>
			</form>
		</div>
	);
}

function CreateNewChat(user: i.User) {
	console.log(user.name);
}
