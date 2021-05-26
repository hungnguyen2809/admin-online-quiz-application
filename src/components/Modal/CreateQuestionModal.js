import {
	Button,
	Col,
	Input,
	Modal,
	notification,
	Row,
	Select,
	Switch,
} from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { debounce, get, isEmpty, map, size, trim, upperCase } from "lodash";
import React, { PureComponent } from "react";
import { FONT_FAMILY } from "../../constants/Styles";
import { ExportExcel } from "../../utils/common";
import ReadFileExcell from "read-excel-file";

const { Option } = Select;

const optionsLevel = [
	{
		value: "E",
		label: "Dễ",
	},
	{
		value: "M",
		label: "Trung bình",
	},
	{
		value: "H",
		label: "Khó",
	},
];

class CreateQuestionModal extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			listQuestionSet: [],
			questionSetOption: null,

			checkCreate: false,
			nameExam: "",
			level: null,

			file: null,
		};
	}

	componentDidMount() {
		if (!!this.props.listQuestionSet) {
			this.setState({ listQuestionSet: this.props.listQuestionSet });
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			!!nextProps.listQuestionSet &&
			this.props.listQuestionSet !== nextProps.listQuestionSet
		) {
			this.setState({ listQuestionSet: nextProps.listQuestionSet });
		}
	}

	onCloseModal = () => {
		this.setState({
			questionSetOption: null,
			checkCreate: false,
			nameExam: "",
			file: null,
			level: null,
		});
		document.getElementById("inputFileExcel").value = null;
		this.props.onCancel && this.props.onCancel();
	};

	onSubmitModal = () => {
		if (this.state.checkCreate) {
			if (isEmpty(this.state.nameExam)) {
				notification.info({ message: "Bạn chưa điền tên đề thi." });
				return;
			}
			if (this.state.level === null) {
				notification.info({ message: "Bạn chưa chọn mức độ đề thi" });
				return;
			}
		} else {
			if (this.state.questionSetOption === null) {
				notification.info({ message: "Bạn chưa chọn đề thi." });
				return;
			}
		}
		if (this.state.file === null) {
			notification.info({ message: "Chưa chọn file câu hỏi" });
			return;
		}
		try {
			ReadFileExcell(this.state.file).then((rows) => {
				if (size(rows) === 1) {
					notification.info({ message: "File chưa có câu hỏi" });
				} else {
					try {
						rows.shift();
						const dataQues = map(rows, (item) => {
							return {
								content: trim(item[0]),
								as_a: trim(item[1]),
								as_b: trim(item[2]),
								as_c: trim(item[3]),
								as_d: trim(item[4]),
								final: upperCase(trim(item[5])),
							};
						});
						const payload = {
							nameExam: this.state.nameExam,
							level: this.state.level,
							isCreate: this.state.checkCreate,
							id_qestion_set: this.state.questionSetOption,
						};
						this.props.onSubmit &&
							this.props.onSubmit(dataQues, payload, this.onCloseModal);
					} catch (error) {
						alert(error.message);
					}
				}
			});
		} catch (error) {
			alert(error.message);
		}
	};

	onChangeQuestionSetOption = (value) => {
		this.setState({ questionSetOption: value });
	};

	onDowloadTempalte = () => {
		const temp = map([1], (item) => {
			return {
				"Nội dung câu hỏi": "",
				"Đáp án A": "",
				"Đáp án B": "",
				"Đáp án C": "",
				"Đáp án D": "",
				"Đáp án đúng": "",
			};
		});
		const fileName = "TeamplateAddQuestion";
		ExportExcel(temp, fileName, fileName);
	};

	handleChange = (e) => {
		const files = e.target.files;
		if (files && files[0]) this.setState({ file: files[0] });
	};

	onChangeLevelOption = (value) => {
		this.setState({ level: value });
	};

	render() {
		return (
			<Modal
				visible={this.props.visible}
				style={{ fontFamily: FONT_FAMILY }}
				width={500}
				closeIcon={[]}
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
				<Title level={5} style={{ textAlign: "center", marginBottom: 10 }}>
					Thêm mới câu hỏi
				</Title>
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<Select
							value={this.state.questionSetOption}
							style={{ width: "100%" }}
							placeholder={"Chọn đề thi"}
							onChange={this.onChangeQuestionSetOption}
						>
							{map(this.state.listQuestionSet, (item) => {
								return (
									<Option key={item.id} value={item.id}>
										{get(item, "description")}
									</Option>
								);
							})}
						</Select>
					</Col>
				</Row>
				<br />
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<Text style={{ marginRight: 10 }}>Tạo đề mới</Text>
						<Switch
							checked={this.state.checkCreate}
							onChange={(checked) => {
								if (checked === false) {
									this.setState({
										checkCreate: checked,
										nameExam: "",
										questionSetOption: null,
										level: null,
									});
								} else {
									this.setState({
										checkCreate: checked,
										questionSetOption: null,
										level: null,
									});
								}
							}}
						/>
						<Input
							disabled={!this.state.checkCreate}
							placeholder={"Tên đề thi"}
							value={this.state.nameExam}
							style={{ width: "100%", height: 36, marginTop: 10 }}
							onChange={(ev) => this.setState({ nameExam: ev.target.value })}
						/>
						<Select
							disabled={!this.state.checkCreate}
							value={this.state.level}
							style={{ width: "100%", marginTop: 10 }}
							placeholder={"Chọn mức độ"}
							onChange={this.onChangeLevelOption}
						>
							{map(optionsLevel, (item) => {
								return (
									<Option key={item.value} value={item.value}>
										{item.label}
									</Option>
								);
							})}
						</Select>
					</Col>
				</Row>
				<br />
				<Row gutter={[10, 10]}>
					<Col span={24}>
						<Button onClick={this.onDowloadTempalte}>Tải về mẫu</Button>
						<br />
						<input
							id="inputFileExcel"
							type={"file"}
							style={{ margin: "10px 0px" }}
							accept={".xlsx"}
							onChange={this.handleChange}
						/>
					</Col>
				</Row>
			</Modal>
		);
	}
}

export default CreateQuestionModal;
