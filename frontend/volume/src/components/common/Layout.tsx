import { Link } from "react-router-dom";
import "src/styles/style.css";

function Layout(): JSX.Element {
	return (
		<div className="background">
			<div className="content-block">
				<div className="header">
					<section className="row">
						<Link to="/lobby">
							<div>Lobby</div>
						</Link>
						<Link to="/lobby">
							<div>Leaderboard</div>
						</Link>
						<Link to="/lobby">
							<div>Settings</div>
						</Link>
					</section>
				</div>
				<div className="content"></div>
			</div>
		</div>
	);
}
export default Layout;
