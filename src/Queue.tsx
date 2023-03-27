import './css/style.css'
import {queue} from './Defines/data'
import * as i from './Defines/Interfaces'

function Queue(props: i.ModalProps) {
	if (queue.length === 0)
		return (<></>);
	
	return (
		<>
		{queue.map(function(game) {
			if (!game.playerOne)
				return (<></>);
			if (!game.playerTwo)
				return (<></>);
			return (
				// TO DO: Add a unique key to the div
				<div className='flex_row_spacebetween' key={game.playerOne.name + game.playerTwo.name}>
					<div className='player player--one' onClick={() => props.togglePopup(game.playerOne)}>
		 				<h3 className='name'>{game.playerOne.name}</h3>
		 				<img className='avatar' src={game.playerOne.avatar}/>
		 			</div>

		 			<div className='player player--two'onClick={() => props.togglePopup(game.playerTwo)}>
		 				<img className='avatar' src={game.playerTwo.avatar}/>
		 				<h3 className='name'>{game.playerTwo.name}</h3>
		 			</div>
				</div>

				);
			})}
			<div className='join_queue'>
				<a>+ join queue</a>
			</div>
		</>
	);
}

export default Queue
