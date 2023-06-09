import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import * as i from "src/types/Interfaces";
import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

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

const GET_RANKING = gql`
	query getRanking {
		getRanking {
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
	const {
		data: ranking_data,
		loading: ranking_loading,
		error: ranking_error,
		subscribeToMore,
	} = useQuery(GET_RANKING);

	useEffect(() => {
		return subscribeToMore({
			document: RANKING_CHANGED,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newRanking = subscriptionData.data.rankingChanged;
				return Object.assign({}, prev, {
					getRanking: newRanking,
				});
			},
		});
	}, []);

	if (ranking_loading) return <div> Updating ranking. Please wait </div>;
	if (ranking_error) {
		console.log(ranking_error);
		return <div> Error </div>;
	}
	// console.log(data.ranking);
	return (
		<table>
			{
				<tbody>
					//{" "}
					{ranking_data.getRanking.map(function (ranking: any) {
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
