import "src/styles/style.css";
import UserStats from "src/components/common/UserStats";
import * as i from "src/types/Interfaces";
import { gql } from "@apollo/client";
import { useQueryWithSubscription } from "src/utils/useQueryWithSubscription";

const GET_INITIAL_RANKING = gql`
	query getInitialRanking {
		getInitialRanking {
			user {
				id
				username
				avatar {
					file
				}
			}
			rank
			wins
			losses
			score
		}
	}
`;

const RANKING_CHANGED = gql`
	subscription rankingHasBeenUpdated {
		rankingHasBeenUpdated {
			user {
				id
				username
				avatar {
					file
				}
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
				avatar {
					file
				}
			}
			rank
			wins
			losses
			score
		}
	}
`;

function Ranking(modalProps: i.ModalProps) {
	const {
		data: ranking,
		loading: queryLoading,
		error: queryError,
	} = useQueryWithSubscription(GET_INITIAL_RANKING, RANKING_CHANGED);

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
							onClick={() => {
								modalProps.toggleModal(
									<UserStats {...modalProps} selectedUser={ranking.user} />
								);
							}}
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
