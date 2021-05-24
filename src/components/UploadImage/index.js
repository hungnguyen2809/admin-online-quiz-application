import { Upload, message, Button } from "antd";
import { FileImageFilled } from "@ant-design/icons";
import { isEmpty } from "lodash";
import React from "react";
import "./UploadImage.css";

class UploadImage extends React.Component {
	state = {
		loading: false,
		fileList: [],
	};

	onEmptyFileList = () => {
		if (!isEmpty(this.state.fileList)) {
			this.setState({ fileList: [] });
		}
	};

	handleChange = (info) => {
		if (this.state.fileList.length === 1) {
			this.props.onChangeFile &&
				this.props.onChangeFile(this.state.fileList[0]);
		} else {
			this.props.onChangeFile && this.props.onChangeFile(null);
		}
	};

	onRemoveFile = (file) => {
		this.setState((state) => {
			const index = state.fileList.indexOf(file);
			const newFileList = state.fileList.slice();
			newFileList.splice(index, 1);
			return {
				fileList: newFileList,
			};
		});
	};

	onBeforeUpload = (file) => {
		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
		const isLt2M = file.size / 1024 / 1024 < 2;
		const lengthFileList = this.state.fileList.length !== 1;
		if (!isJpgOrPng) {
			message.error("Bạn chỉ được chọn ảnh có định dạng JPG/PNG!");
		} else if (!isLt2M) {
			message.error("Ảnh có kích thước lớn hơn 2MB!");
		} else if (!lengthFileList) {
			message.error("Bạn chỉ được chọn một ảnh.");
		} else {
			this.setState((state) => ({
				fileList: [...state.fileList, file],
			}));
		}
		return isJpgOrPng && isLt2M && lengthFileList;
	};

	render() {
		return (
			<Upload
				onRemove={this.onRemoveFile}
				beforeUpload={this.onBeforeUpload}
				fileList={this.state.fileList}
				onChange={this.handleChange}
			>
				<Button icon={<FileImageFilled />}>Chọn ảnh</Button>
			</Upload>
		);
	}
}

export default UploadImage;
