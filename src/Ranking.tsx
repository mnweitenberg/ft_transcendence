import './css/style.css'
import {ranking} from './Defines/data'

function Ranking() {
	return (
		<table>
			<tbody>
			{ranking.map(function(ranking: any) {
				return (
					<tr key={ranking.user.name}>
						<td>{ranking.rank}</td>
						<td>{ranking.user.name}</td>
						<td className='align_right'>{ranking.user.stats.wins} wins</td>
						<td className='align_right'>{ranking.user.stats.losses} losses</td>
						<td className='align_right'>{ranking.user.stats.score}</td>
					</tr>
				);
			})}
			</tbody>
		</table>
	);
}

export default Ranking
