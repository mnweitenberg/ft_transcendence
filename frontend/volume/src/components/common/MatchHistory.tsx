import "../../styles/style.css";
import * as i from "../../types/Interfaces";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { useState, useEffect } from "react";

const MATCH_HISTORY_CHANGED = gql`
	subscription matchHistoryHasBeenUpdated {
		matchHistoryHasBeenUpdated {
			id
			p1
			p1Avatar
			p1Score
			p2
			p2Avatar
			p2Score
		}
	}
`;

const GET_INITIAL_MATCH_HISTORY = gql`
	query getInitialMatchHistory {
		getInitialMatchHistory {
			id
			p1
			p1Avatar
			p1Score
			p2
			p2Avatar
			p2Score
		}
	}
`;

function MatchHistory() {
	// function MatchHistory({ user }: { user: i.User }) {
	const [matchHistory, setRanking] = useState([]);
	const { data: subscriptionData } = useSubscription(MATCH_HISTORY_CHANGED);
	const {
		data: queryData,
		loading: queryLoading,
		error: queryError,
	} = useQuery(GET_INITIAL_MATCH_HISTORY);

	useEffect(() => {
		if (subscriptionData) setRanking(subscriptionData.matchHistoryHasBeenUpdated);
		if (queryData) setRanking(queryData.getInitialMatchHistory);
	}, [subscriptionData, queryData]);

	if (queryLoading) return <div> Loading </div>;
	if (queryError) return <div> Error </div>;

	console.log("matchHistory", matchHistory);
	return (
		<div className="stat_block">
			<h2>Match history</h2>
			<table className="match_history">
				<tbody>
					{matchHistory.map((match: any) => (
						<tr key={match.id}>
							<td className="td_ava">
								<img className="match_avatar" src={match.p1Avatar} />
							</td>

							<td className="td_name">{match.p1}</td>

							<td className="td_score align_right">
								<h4>{match.p1Score}</h4>
							</td>

							<td className="td_score align_right">
								<h4>{match.p2Score}</h4>
							</td>

							<td className="td_name align_right">{match.p2}</td>

							<td className="td_ava">
								<img className="match_avatar" src={match.p2Avatar} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default MatchHistory;
