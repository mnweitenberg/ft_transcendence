import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import * as i from "src/types/Interfaces";
import { useState, useEffect } from "react";
import { gql, useQuery, useSubscription } from "@apollo/client";

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

const GET_INITIAL_RANKING = gql`
	query getInitialRanking {
		getInitialRanking {
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
	const { data: subscriptionData } = useSubscription(RANKING_CHANGED);
	const {
		data: queryData,
		loading: queryLoading,
		error: queryError,
	} = useQuery(GET_INITIAL_RANKING);

	useEffect(() => {
		if (queryData) setRanking(queryData.getInitialRanking);
	}, [queryData]);

	useEffect(() => {
		if (subscriptionData) setRanking(subscriptionData.rankingHasBeenUpdated);
	}, [subscriptionData]);

	if (queryLoading) return <div> Loading </div>;
	if (queryError) return <div> Error </div>;
	return (
		<table>
			<thead>
				<tr>
					<th>Rank</th>
					<th>Username</th>
					<th className="align_right">Wins</th>
					<th className="align_right">Losses</th>
					<th className="align_right">Score</th>
				</tr>
			</thead>
			<tbody>
				{ranking.map((ranking: any) => {
					return (
						<tr
							key={ranking.user.username}
							onClick={() =>
								propsModal.toggleModal(ranking.user, <UserStats {...propsModal} />)
							}
						>
							<td>{ranking.rank}</td>
							<td>{ranking.user.username}</td>
							<td className="align_right">{ranking.wins}</td>
							<td className="align_right">{ranking.losses}</td>
							<td className="align_right">{ranking.score}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

export default Ranking;
