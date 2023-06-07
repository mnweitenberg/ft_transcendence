import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import * as i from "src/types/Interfaces";
import { useState, useEffect } from "react";
import { gql, useSubscription } from "@apollo/client";

const RANKING_CHANGED = gql`
	subscription rankingHasBeenUpdated {
		rankingHasBeenUpdated {
			id
			user {
				id
				intra_id
				username
				avatar
				groups_chats
				personal_chats
				ranking
				match_history
			}
			rank
			wins
			losses
			score
		}
	}
`;

function Ranking(propsModal: i.ModalProps) {
	const [ranking, setRanking] = useState([]);
	const { data, loading, error } = useSubscription(RANKING_CHANGED);

	useEffect(() => {
		if (data) {
			setRanking(data.rankingHasBeenUpdated);
		}
	}, [data]);

	if (loading) return <div> Updating ranking. Please wait </div>;
	if (error) return <div> Error </div>;
	console.log(ranking);
	return (
		<table>
			{/* <tbody>
				{ranking.map(function (ranking: any) {
					return (
						<tr
							key={ranking.user.name}
							onClick={() =>
								propsModal.toggleModal(ranking.user, <UserStats {...propsModal} />)
							}
						>
							<td>{ranking.rank}</td>
							<td>{ranking.user.name}</td>
							<td className="align_right">{ranking.user.stats.wins} wins</td>
							<td className="align_right">{ranking.user.stats.losses} losses</td>
							<td className="align_right">{ranking.user.stats.score}</td>
						</tr>
					);
				})}
			</tbody> */}
		</table>
	);
}

export default Ranking;
