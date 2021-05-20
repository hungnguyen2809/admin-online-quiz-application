import { Button, Form, Input } from "antd";
import Title from "antd/lib/typography/Title";
import { get } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { handleLoginAccountAction } from "../../redux/Account/actions";
import { getLocalData } from "../../services/StoreService";
import { EncriptPassword, validateEmail } from "../../utils/common";
import "./LoginPage.css";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	onSubmitForm = (data) => {
		const email = get(data, "email");
		const password = get(data, "password");
		const payload = {
			email,
			password: EncriptPassword(email, password),
		};
		this.props.doLoginAccount(payload, {
			callbackOnSuccess: () => {
				window.location.reload();
			},
		});
	};

	render() {
		if (getLocalData("access_token") || getLocalData("access_token") !== null) {
			return <Redirect to="/" />;
		} else {
			return (
				<main className="wrap-form">
					<div className="form-login">
						<Title level={3} style={{ textAlign: "center" }}>
							ĐĂNG NHẬP
						</Title>
						<Form onFinish={this.onSubmitForm}>
							<Form.Item
								name={"email"}
								rules={[
									{
										required: true,
										message: "Chưa điền tài khoản",
									},
									() => ({
										validator: (_, value) => {
											if (validateEmail(value) || !value) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error("Email không đúng định dạng")
											);
										},
									}),
								]}
							>
								<Input
									placeholder={"Địa chỉ email"}
									style={{ width: 350, height: 36 }}
								/>
							</Form.Item>
							<Form.Item
								name={"password"}
								rules={[
									{
										required: true,
										message: "Chưa điền mật khẩu",
									},
								]}
							>
								<Input.Password
									placeholder={"Mật khẩu"}
									style={{ width: 350, height: 36 }}
								/>
							</Form.Item>
							<Form.Item wrapperCol={{ offset: 8 }}>
								<Button
									type={"primary"}
									style={{ height: 36 }}
									htmlType={"submit"}
								>
									Đăng nhập
								</Button>
							</Form.Item>
						</Form>
					</div>
				</main>
			);
		}
	}
}

const mapStateToProp = createStructuredSelector({});

const mapDispatchToProps = (dispatch) => {
	return {
		doLoginAccount: (payload, callbacks) => {
			dispatch(handleLoginAccountAction(payload, callbacks));
		},
	};
};

export default connect(mapStateToProp, mapDispatchToProps)(Login);
