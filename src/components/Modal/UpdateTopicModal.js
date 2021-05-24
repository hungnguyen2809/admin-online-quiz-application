import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
	Button,
	Col,
	Image,
	Input,
	Modal,
	notification,
	Row,
	Switch,
} from "antd";
import Title from "antd/lib/typography/Title";
import { Colors, FONT_FAMILY } from "../../constants/Styles";
import { debounce, get, isEmpty } from "lodash";
import Text from "antd/lib/typography/Text";
import UploadImage from "../UploadImage";

class UpdateTopicModal extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			dataSource: {},
			image: null,
		};
		this.refUploadImage = React.createRef();
	}

	componentDidMount() {
		if (!!this.props.dataSource) {
			this.setState({ dataSource: this.props.dataSource });
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			!!nextProps.dataSource &&
			this.props.dataSource !== nextProps.dataSource
		) {
			this.setState({ dataSource: nextProps.dataSource });
		}
	}

	onCloseModal = () => {
		this.refUploadImage.current.onEmptyFileList &&
			this.refUploadImage.current.onEmptyFileList();
		this.props.onCancel && this.props.onCancel();
	};

	onSubmitModal = () => {
		const name = get(this.state.dataSource, "name", "");

		if (isEmpty(name)) {
			notification.info({
				message: "Chưa điền tên chủ đề",
				style: { fontFamily: FONT_FAMILY },
			});
			return;
		}
		this.props.onSubmit &&
			this.props.onSubmit(
				this.state.dataSource,
				this.state.image,
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
					Cập nhật chủ đề
				</Title>
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<Text>Nhập tên chủ đề</Text>
						<Input
							value={get(this.state.dataSource, "name")}
							placeholder={"Tên chủ đề"}
							style={{ width: "100%", height: 36 }}
							onChange={(ev) => {
								this.setState((prevState) => {
									return {
										dataSource: {
											...prevState.dataSource,
											name: ev.target.value,
										},
									};
								});
							}}
							max={200}
						/>
					</Col>
				</Row>
				<br />
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<Text>Nhập mô tả</Text>
						<Input.TextArea
							value={get(this.state.dataSource, "description", "")}
							autoSize={{ maxRows: 5, minRows: 5 }}
							placeholder={"Mô tả"}
							style={{ width: "100%", height: 36 }}
							onChange={(ev) => {
								this.setState((prevState) => {
									return {
										dataSource: {
											...prevState.dataSource,
											description: ev.target.value,
										},
									};
								});
							}}
							maxLength={250}
						/>
					</Col>
				</Row>
				<br />
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<Image
							src={get(this.state.dataSource, "image")}
							style={{ width: 80, height: 80 }}
							alt={get(this.state.dataSource, "name")}
						/>
						<br />
						<UploadImage
							ref={this.refUploadImage}
							onChangeFile={(data) => {
								this.setState({ image: data });
							}}
						/>
					</Col>
				</Row>
				<br />
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<Text>Trạng thái</Text>
						<br />
						<Switch
							checked={get(this.state.dataSource, "status") === 1}
							onChange={(checked) => {
								this.setState((prevState) => {
									return {
										dataSource: {
											...prevState.dataSource,
											status: checked ? 1 : 0,
										},
									};
								});
							}}
						/>
						<Text
							style={{
								color:
									get(this.state.dataSource, "status") === 1
										? Colors.UFO_GREEN
										: Colors.TOMATO_RED,
								marginLeft: 10,
							}}
						>
							{get(this.state.dataSource, "status") === 1
								? "Hoạt động"
								: "Tạm dừng"}
						</Text>
					</Col>
				</Row>
			</Modal>
		);
	}
}

UpdateTopicModal.propTypes = {
	visible: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	dataSource: PropTypes.object,
};

export default UpdateTopicModal;
