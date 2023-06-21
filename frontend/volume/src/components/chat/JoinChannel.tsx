import "../../styles/style.css";
// import { publicChannels, privateChannels } from "../../utils/data";

export default function JoinChannel() {
	return (
		<div className="new_chat">
			<div className="flex_row_spacebetween">
				<a id="publicLink" onClick={() => showDiv("publicChannel")}>
					public channel
				</a>
				<a id="privateLink" onClick={() => showDiv("privateChannel")}>
					private channel
				</a>
			</div>

			<PrivateChannel />
			<PublicChannel />
		</div>
	);
}

function showDiv(div: string) {
	const privateChannel = document.getElementById("privateChannel");
	const publicChannel = document.getElementById("publicChannel");
	const privateLink = document.getElementById("privateLink");
	const publicLink = document.getElementById("publicLink");

	if (!privateChannel || !publicChannel || !privateLink || !publicLink) return;

	if (div === "privateChannel") {
		privateChannel.style.display = "block";
		publicChannel.style.display = "none";
		privateLink.style.fontWeight = "bold";
		publicLink.style.fontWeight = "normal";
	}
	if (div === "publicChannel") {
		privateChannel.style.display = "none";
		publicChannel.style.display = "block";
		privateLink.style.fontWeight = "normal";
		publicLink.style.fontWeight = "bold";
	}
}

function PrivateChannel() {
	return (
		<div id="privateChannel">
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

function PublicChannel() {
	return (
		<div id="publicChannel">
			{/* {publicChannels.map(function (channel: any) {
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

function Join(channel: string) {
	console.log(channel);
}
