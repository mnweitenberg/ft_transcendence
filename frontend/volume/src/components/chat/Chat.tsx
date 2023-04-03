import { useState } from "react";
import "../../styles/style.css";
import Overview from "./Overview";
import PersonalMessage from "./PersonalMessage";
import * as i from "../../types/Interfaces";
import { ChatState } from "../../utils/constants";
import GroupMessage from "./GroupMessage";

export default function Chat(props: i.ModalProps) {
	const [chatState, setChatState] = useState(ChatState.overview);

	function renderOverview() {
		setChatState(ChatState.overview);
	}

	if (chatState === ChatState.overview)
		return <Overview props={props} setChatState={setChatState} />;

	if (chatState === ChatState.personalMessage)
		return <PersonalMessage props={props} renderOverview={renderOverview} />;

	if (chatState === ChatState.groupMessage)
		return <GroupMessage props={props} renderOverview={renderOverview} />;

	return <>No state defined</>;
}
