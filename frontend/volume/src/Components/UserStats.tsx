import '../css/style.css'
import Stats from './Stats';
import MatchHistory from './MatchHistory';
import Friends from './Friends';
import * as i from '../Defines/Interfaces'

function UserStats({ user }: { user: i.User}) {
	return (
		<div className='userStats'>

			<div className='user'>
				<img className='avatar' src={user.avatar} />

				<div className='user_actions'>
					<h1>{user.name}</h1>
					<a className='link'>challenge</a>
					<a className='link'>send friend request</a>
					<a className='link'>block</a>
				</div>
			</div>

			<Stats user={ user }/>
			
			<MatchHistory user={ user }/>

			<Friends user={ user }/>
		</div>
	);
}

export default UserStats