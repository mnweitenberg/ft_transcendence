import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "src/styles/style.css";

interface ComponentProps {
	children: ReactNode;
}

function Layout({ children }: ComponentProps): JSX.Element {
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
