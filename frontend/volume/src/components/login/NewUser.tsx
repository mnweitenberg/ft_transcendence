function NewUser(): JSX.Element {
	return (
		<div className="userForm">
			<div className="userForm">
				<form>
					<label htmlFor="name">Name:</label>
					<input type="text" id="username" name="username" />
					<input type="file" name="profile picture" />
				</form>
			</div>
		</div>
	);
}
export default NewUser;
