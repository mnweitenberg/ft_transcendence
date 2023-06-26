import { Link } from "react-router-dom";
import { CompProps } from "src/types/Interfaces";
import "src/styles/style.css";

function Layout({ children }: CompProps): JSX.Element {
	return (
		<div className="background">
			<div className="content-block">
				<div className="header">
					<section className="row">
						<Link to="/lobby">
							<div>Lobby</div>
						</Link>
						<Link to="/leaderboard">
							<div>Leaderboard</div>
						</Link>
						<Link to="/settings">
							<div>Settings</div>
						</Link>
					</section>
				</div>
				<div className="content">{children}</div>
			</div>
		</div>
	);
}
export default Layout;
