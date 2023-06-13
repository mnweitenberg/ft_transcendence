import "../../styles/style.css";
import { matchHistory } from "../../utils/data";
import * as i from "../../types/Interfaces";
import { getMatchesByUser } from "../../utils/utils";

function MatchHistory({ user }: { user: i.User }) {
	return (
		<div className="stat_block">
			<h2>Match history</h2>
			<table className="match_history">
				<tbody>
					{getMatchesByUser(matchHistory, user).map((match) => (
						<tr key={match.id}>
							<td className="td_ava">
								<img className="match_avatar" src={match.p1.avatar} />
							</td>

							<td className="td_name">{match.p1.name}</td>

							<td className="td_score align_right">
								<h4>{match.score.p1}</h4>
							</td>

							<td className="td_score align_right">
								<h4>{match.score.p2}</h4>
							</td>

							<td className="td_name align_right">{match.p2.name}</td>

							<td className="td_ava">
								<img className="match_avatar" src={match.p2.avatar} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default MatchHistory;
