import React, { Component } from "react";
import { Redirect, Route } from "react-router";
import { getLocalData } from "../services/StoreService";

class PrivateRoute extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		if (!getLocalData("access_token") || getLocalData("access_token") === null)
			return (
				<Redirect
					to={{
						pathname: "/login",
						state: {
							from: this.props.location,
						},
					}}
				/>
			);
		return <Route {...this.props} />;
	}
}

export default PrivateRoute;
