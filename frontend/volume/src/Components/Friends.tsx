import '../css/style.css'
import * as i from '../Defines/Interfaces'

function Friends({ user, propsModal }: { user: i.User, propsModal: i.ModalProps}) {
	return (
		<div className='stat_block'>
		<h2>Friends</h2>
		<div className='friend_list'>
			{user.friends && user.friends.map(function(friend){
				return (<img className='friend_list--avatar' 
						onClick={() => propsModal.togglePopup(friend)}
						key={friend.name} src={friend.avatar}/>);
			})}
		</div>
		</div>
	);
}

export default Friends
