import { Button } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class ErrorPage extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div style={{ textAlign: "center" }}>
				<h1>404</h1>
				<Button type={"primary"}>
					<Link to={'/'}>Trang chủ</Link>
				</Button>
			</div>
		);
	}
}

export default ErrorPage;
