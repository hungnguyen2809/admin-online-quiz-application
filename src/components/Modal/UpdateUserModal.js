import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button, Col, Input, Modal, notification, Row, Switch } from "antd";
import Title from "antd/lib/typography/Title";
import { Colors, FONT_FAMILY } from "../../constants/Styles";
import { debounce, get, isEmpty, size, trim } from "lodash";
import Text from "antd/lib/typography/Text";
import { EncriptPassword, validateEmail } from "../../utils/common";

class UpdateUserModal extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			dataSource: {},
			dataUpdate: {},
			passChange: "",
		};
	}

	componentDidMount() {
		if (!!this.props.dataSource) {
			const mapObj = { ...this.props.dataSource, edit: false };
			this.setState({ dataSource: mapObj, dataUpdate: mapObj });
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			!!nextProps.dataSource &&
			this.props.dataSource !== nextProps.dataSource
		) {
			const mapObj = { ...nextProps.dataSource, edit: false };
			this.setState({ dataSource: mapObj, dataUpdate: mapObj });
		}
	}

	onCloseModal = () => {
		this.setState({ dataUpdate: this.state.dataSource, passChange: "" });
		this.props.onCancel && this.props.onCancel();
	};

	onSubmitModal = () => {
		if (isEmpty(trim(get(this.state.dataUpdate, "email", "")))) {
			notification.info({
				message: "Tên người dùng không được để trống",
				style: { fontFamily: FONT_FAMILY },
			});
			return;
		}
		if (!validateEmail(trim(get(this.state.dataUpdate, "email", "")))) {
			notification.info({
				message: "Email không đúng định dạng.",
				style: { fontFamily: FONT_FAMILY },
			});
			return;
		}
		let passChange = "";
		if (get(this.state.dataUpdate, "edit", false)) {
			if (size(trim(this.state.passChange)) < 5) {
				notification.info({
					message: "Mật khẩu tối thiểu 5 ký tự",
					style: { fontFamily: FONT_FAMILY },
				});
				return;
			}
			passChange = EncriptPassword(
				trim(get(this.state.dataUpdate, "email", "")),
				trim(this.state.passChange)
			);
		}
		this.props.onSubmit &&
			this.props.onSubmit(
				{ ...this.state.dataUpdate, passChange },
				this.onCloseModal
			);
	};

	render() {
		return (
			<Modal
				visible={this.props.visible}
				style={{ fontFamily: FONT_FAMILY }}
				width={500}
				onCancel={debounce(this.onCloseModal, 300)}
				footer={[
					<Button
						key={"submit"}
						type={"primary"}
						onClick={debounce(this.onSubmitModal, 300)}
					>
						Cập nhật
					</Button>,
					<Button key={"destroy"} onClick={debounce(this.onCloseModal, 300)}>
						Hủy
					</Button>,
				]}
			>
				<Title level={5} style={{ textAlign: "center" }}>
					Cập nhật tài khoản: {get(this.state.dataUpdate, "name")}
				</Title>
				<br />
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<Text>Email</Text>
						<Input
							value={get(this.state.dataUpdate, "email")}
							placeholder={"Địa chỉ email"}
							style={{ width: "100%", height: 36 }}
							onChange={(ev) => {
								this.setState((prevState) => {
									return {
										dataUpdate: {
											...prevState.dataUpdate,
											email: ev.target.value,
										},
									};
								});
							}}
							max={100}
						/>
					</Col>
				</Row>
				<br />
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<Text>Cập nhật khẩu </Text>
						<Switch
							checked={get(this.state.dataUpdate, "edit")}
							onChange={(checked) => {
								this.setState((prevState) => {
									return {
										dataUpdate: {
											...prevState.dataUpdate,
											edit: checked,
										},
										passChange: "",
									};
								});
							}}
						/>
						<Input
							disabled={!get(this.state.dataUpdate, "edit")}
							value={this.state.passChange}
							placeholder={"Mật khẩu mới"}
							style={{ width: "100%", height: 36, marginTop: 10 }}
							onChange={(ev) => {
								this.setState({ passChange: ev.target.value });
							}}
							max={20}
						/>
					</Col>
				</Row>
				<br />
				<Row gutter={[10, 10]}>
					<Col span={12}>
						<Text>Trạng thái</Text>
						<br />
						<Switch
							checked={get(this.state.dataUpdate, "status") === 1}
							onChange={(checked) => {
								this.setState((prevState) => {
									return {
										dataUpdate: {
											...prevState.dataUpdate,
											status: checked ? 1 : 0,
										},
									};
								});
							}}
						/>
						<Text
							style={{
								color:
									get(this.state.dataUpdate, "status") === 1
										? Colors.UFO_GREEN
										: Colors.TOMATO_RED,
								marginLeft: 10,
							}}
						>
							{get(this.state.dataUpdate, "status") === 1
								? "Hoạt động"
								: "Tạm dừng"}
						</Text>
					</Col>
					<Col span={12}>
						<Text>ADMIN</Text>
						<br />
						<Switch
							checked={get(this.state.dataUpdate, "permission") === 1}
							onChange={(checked) => {
								this.setState((prevState) => {
									return {
										dataUpdate: {
											...prevState.dataUpdate,
											permission: checked ? 1 : 0,
										},
									};
								});
							}}
						/>
						<Text
							style={{
								color:
									get(this.state.dataUpdate, "permission") === 1
										? Colors.RED_ORANGE
										: Colors.DARK_MOUNTAIN,
								marginLeft: 10,
							}}
						>
							{get(this.state.dataUpdate, "permission") === 1
								? "ADMIN"
								: "USER"}
						</Text>
					</Col>
				</Row>
			</Modal>
		);
	}
}

UpdateUserModal.propTypes = {
	visible: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	dataSource: PropTypes.object,
};

export default UpdateUserModal;
