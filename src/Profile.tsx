import './css/style.css'
import { user} from './Defines/data'
import Stats from './Components/Stats';
import MatchHistory from './Components/MatchHistory';
import Friends from './Components/Friends';
import * as i from './Defines/Interfaces'

function Profile(propsModal: i.ModalProps) {
	return (
		<>
			<Stats user={ user }/>

			<div className='match_history'>
				<MatchHistory user={ user }/>
			</div>

			<div className='friends'>
				<Friends user={ user } propsModal={propsModal}/>
			</div>

			<div className='profile_section settings'>
				<h2>Settings</h2>
				<div className='flex_row_spacebetween'>
					<a onClick={ChangeUsername}>change Username</a>
					<a onClick={ChangeAvatar}>change avatar</a>
				</div>
			</div>
		</>
	);
}

function ChangeUsername () {
	console.log("ChangeUsername");
}

function ChangeAvatar () {
	console.log("ChangeAvatar");
}

export default Profile
