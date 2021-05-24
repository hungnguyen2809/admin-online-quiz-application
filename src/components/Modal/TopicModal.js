import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button, Col, Input, Modal, notification, Row } from "antd";
import Title from "antd/lib/typography/Title";
import { FONT_FAMILY } from "../../constants/Styles";
import { debounce, isEmpty } from "lodash";
import UploadImage from "../UploadImage";

class TopicModal extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			nameTopic: "",
			desTopic: "",
			image: null,
		};

		this.refUploadImage = React.createRef();
	}

	componentDidMount() {}

	onCloseModal = () => {
		this.setState({ nameTopic: "", desTopic: "", image: null });
		this.refUploadImage.current.onEmptyFileList &&
			this.refUploadImage.current.onEmptyFileList();
		this.props.onCancel && this.props.onCancel();
	};

	onSubmitModal = () => {
		if (isEmpty(this.state.nameTopic)) {
			notification.info({
				message: "Chưa điền tên chủ đề",
				style: { fontFamily: FONT_FAMILY },
			});
			return;
		}
		if (isEmpty(this.state.image)) {
			notification.info({
				message: "Chưa chọn hình ảnh",
				style: { fontFamily: FONT_FAMILY },
			});
			return;
		}
		const paylaod = {
			image: this.state.image,
			nameTopic: this.state.nameTopic,
			desTopic: this.state.desTopic,
		};
		this.props.onSubmit && this.props.onSubmit(paylaod, this.onCloseModal);
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
						Xác nhận
					</Button>,
					<Button key={"destrp=oy"} onClick={debounce(this.onCloseModal, 300)}>
						Hủy
					</Button>,
				]}
			>
				<Title level={5} style={{ textAlign: "center" }}>
					Thêm mới chủ đề
				</Title>
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<Input
							value={this.state.nameTopic}
							placeholder={"Tên chủ đề"}
							style={{ width: "100%", height: 36 }}
							onChange={(ev) => {
								this.setState({ nameTopic: ev.target.value });
							}}
							max={200}
						/>
					</Col>
				</Row>
				<br />
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<Input.TextArea
							value={this.state.desTopic}
							autoSize={{ maxRows: 5, minRows: 5 }}
							placeholder={"Mô tả"}
							style={{ width: "100%", height: 36 }}
							onChange={(ev) => {
								this.setState({ desTopic: ev.target.value });
							}}
							maxLength={250}
						/>
					</Col>
				</Row>
				<br />
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<UploadImage
							ref={this.refUploadImage}
							onChangeFile={(data) => {
								this.setState({ image: data });
							}}
						/>
					</Col>
				</Row>
			</Modal>
		);
	}
}

TopicModal.propTypes = {
	visible: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	dataSource: PropTypes.array,
};

export default TopicModal;
