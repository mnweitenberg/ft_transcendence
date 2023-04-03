import "../styles/style.css";
import UserStats from "../components/common/UserStats";
import { ranking } from "../utils/data";
import * as i from "../types/Interfaces";

function Ranking(propsModal: i.ModalProps) {
	return (
		<table>
			<tbody>
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
			</tbody>
		</table>
	);
}

export default Ranking;
