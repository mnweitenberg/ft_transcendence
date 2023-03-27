import '../css/style.css'
import { getWinsByUser, getLossesByUser } from './utils';
import { matchHistory } from '../Defines/data';
import * as i from '../Defines/Interfaces'

function Stats({ user }: { user: i.User}) {
	return (
		<div className='stat_block'>
		<h2>Stats</h2>
		<table>
			<tbody>
			<tr>
				<td>Ranking</td>
				<td className='align_right'>{user.stats.ranking}</td>
				<td></td>
				<td>Wins</td>
				<td className='align_right'>{user.stats.wins}</td>
			</tr>
			<tr>
				<td>Score</td>
				<td className='align_right'>{user.stats.score}</td>
				<td></td>
				<td>Losses</td>
				<td className='align_right'>{user.stats.losses}</td>
			</tr>
			</tbody>
		</table>
		</div>
	);
}

export default Stats