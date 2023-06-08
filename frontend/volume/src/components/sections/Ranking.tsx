import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import * as i from "src/types/Interfaces";
import { useState, useEffect } from "react";
import { gql, useSubscription } from "@apollo/client";

const RANKING_CHANGED = gql`
	subscription rankingHasBeenUpdated {
		rankingHasBeenUpdated {
			user {
				id
				intraId
				username
				avatar
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
	if (error) {
		console.log(error);
		return <div> Error </div>;
	}
	console.log(ranking);
	return (
		<table>
			{
				<tbody>
					//{" "}
					{ranking.map(function (ranking: any) {
						return (
							<tr
								key={ranking.user.username}
								onClick={() =>
									propsModal.toggleModal(
										ranking.user,
										<UserStats {...propsModal} />
									)
								}
							>
								<td>{ranking.rank}</td>
								<td>{ranking.user.username}</td>
								<td className="align_right">{ranking.wins} wins</td>
								<td className="align_right">{ranking.losses} losses</td>
								<td className="align_right">{ranking.score}</td>
							</tr>
						);
					})}
				</tbody>
			}
		</table>
	);
}

export default Ranking;
