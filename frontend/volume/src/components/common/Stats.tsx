import "../../styles/style.css";
import * as i from "../../types/Interfaces";

interface StatsProps {
	rank: number;
	wins: number;
	losses: number;
	score: number;
}

function Stats({ rank, wins, losses, score }: StatsProps) {
	return (
		<div className="stat_block">
			<h2>Stats</h2>
			<table>
				<tbody>
					<tr>
						<td>Ranking</td>
						<td className="align_right">{rank}</td>
						<td></td>
						<td>Wins</td>
						<td className="align_right">{wins}</td>
					</tr>
					<tr>
						<td>Score</td>
						<td className="align_right">{score}</td>
						<td></td>
						<td>Losses</td>
						<td className="align_right">{losses}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default Stats;
