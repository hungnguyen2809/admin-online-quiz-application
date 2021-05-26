import { PlusCircleFilled } from "@ant-design/icons";
import {
	Button,
	Col,
	notification,
	Row,
	Select,
	Table,
	Tooltip,
	Typography,
} from "antd";
import Title from "antd/lib/typography/Title";
import { debounce, get, map, size } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import CreateQuestionModal from "../../components/Modal/CreateQuestionModal";
import { Colors, FONT_FAMILY } from "../../constants/Styles";
import {
	createUpdateQuestionSetAction,
	getListQuestionAction,
	getOptionQuestionSetAction,
	getOptionTopicQuestionAction,
	handleAddQuestionAction,
} from "../../redux/Question/actions";

const { Option } = Select;

class QuestionManager extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listOptionTopic: [],
			topicOption: null,

			listOptionQuestionSet: [],
			questionSetOption: null,

			listQuestion: [],
			loadingQuestion: false,
			curPageQuestion: 1,

			showModalAddQuestion: false,
		};
	}

	componentDidMount() {
		this.onGetListOptionTopic();
	}

	onGetListOptionTopic = () => {
		this.props.doGetOptionTopicQuestion({
			callbackOnSuccess: (res) => {
				this.setState({ listOptionTopic: res });
			},
		});
	};

	onChangeTopicOption = (value) => {
		this.setState(
			{
				topicOption: value,
				listOptionQuestionSet: [],
				questionSetOption: null,
				listQuestion: [],
			},
			this.onGetListOptionQuestionSet
		);
	};

	onGetListOptionQuestionSet = () => {
		if (this.state.topicOption === null) return;
		const payload = {
			id_topic: this.state.topicOption,
			per: 0,
		};

		this.props.doGetOptionQuestionSet(payload, {
			callbackOnSuccess: (res) => {
				this.setState({ listOptionQuestionSet: res });
			},
		});
	};

	onChangeQuestionSetOption = (value) => {
		this.setState(
			{ questionSetOption: value },
			this.onGetListQuestionByQuestionSet
		);
	};

	onGetListQuestionByQuestionSet = () => {
		if (this.state.questionSetOption === null) return;
		const payload = {
			id_qs: this.state.questionSetOption,
			per: 1,
		};
		this.setState({ loadingQuestion: true });
		this.props.doGetListQuestion(payload, {
			callbackOnSuccess: (res) => {
				const mapData = map(res, (item, idx) => {
					return {
						...item,
						key: idx + 1,
					};
				});
				this.setState({ listQuestion: mapData, loadingQuestion: false });
			},
		});
	};

	onChangePageQuestion = (page) => {
		this.setState({ curPageQuestion: page });
	};

	openCloseModalAddQuestion = () => {
		this.setState({ showModalAddQuestion: !this.state.showModalAddQuestion });
	};

	onSubmitAddQuestion = (dataQues, dataExam, cb = () => {}) => {
		let total = size(dataQues);
		console.log(dataExam);
		console.log(dataQues);
		if (get(dataExam, "isCreate")) {
			let payload = {
				type: 1,
				id_topic: this.state.topicOption,
				des: get(dataExam, "nameExam"),
				level: get(dataExam, "level"),
				id_qs: -1,
				total,
			};
			this.props.doCreateUpdateQuestionSet(payload, {
				callbackOnSuccess: (res) => {
					let id_qs = get(res[0], "id_qs");
					let body = map(dataQues, (item) => {
						return {
							id_qs,
							content: get(item, "content"),
							asA: get(item, "as_a"),
							asB: get(item, "as_b"),
							asC: get(item, "as_c"),
							asD: get(item, "as_d"),
							asFinal: get(item, "final"),
						};
					});
					this.onAddQuestion(body, cb);
				},
			});
		} else {
			let payload = {
				type: 2,
				id_topic: -1,
				des: "nothing",
				level: "nothing",
				id_qs: get(dataExam, "id_qestion_set"),
				total,
			};
			this.props.doCreateUpdateQuestionSet(payload, {
				callbackOnSuccess: (res) => {
					let id_qs = get(dataExam, "id_qestion_set");
					let body = map(dataQues, (item) => {
						return {
							id_qs,
							content: get(item, "content"),
							asA: get(item, "as_a"),
							asB: get(item, "as_b"),
							asC: get(item, "as_c"),
							asD: get(item, "as_d"),
							asFinal: get(item, "final"),
						};
					});
					this.onAddQuestion(body, cb);
				},
			});
		}
	};

	onAddQuestion = (payload, cbSuccess = () => {}) => {
		this.props.doAddQuestion(payload, {
			callbackOnSuccess: ({ success, total }) => {
				notification.success({
					message: "Thông báo",
					description: `Thêm mới thành công ${success}/${total}`,
					style: { fontFamily: FONT_FAMILY },
				});
				this.setState({
					listOptionQuestionSet: [],
					questionSetOption: null,
					listQuestion: [],
					topicOption: null,
				});
				this.onGetListOptionTopic();
				cbSuccess();
			},
			callbackOnFail: ({ fail, total }) => {
				notification.error({
					message: "Thông báo",
					description: `Thêm mới thất bại ${fail}/${total}`,
					style: { fontFamily: FONT_FAMILY },
				});
			},
		});
	};

	render() {
		const colums = [
			{
				title: "STT",
				dataIndex: "key",
				key: "key",
			},
			{
				title: "Mã câu hỏi",
				dataIndex: "id",
				key: "id",
			},
			{
				title: "Nội dung",
				dataIndex: "content",
				key: "content",
				width: 250,
				render: (text) => {
					return (
						<Tooltip title={size(text) > 50 ? text : ""}>
							<Typography.Paragraph ellipsis={{ rows: 2 }}>
								{text}
							</Typography.Paragraph>
						</Tooltip>
					);
				},
			},
			{
				title: "Đáp án A",
				dataIndex: "as_a",
				key: "as_a",
				width: 250,
				render: (text) => {
					return (
						<Tooltip title={size(text) > 50 ? text : ""}>
							<Typography.Paragraph ellipsis={{ rows: 2 }}>
								{text}
							</Typography.Paragraph>
						</Tooltip>
					);
				},
			},
			{
				title: "Đáp án B",
				dataIndex: "as_b",
				key: "as_b",
				width: 250,
				render: (text) => {
					return (
						<Tooltip title={size(text) > 50 ? text : ""}>
							<Typography.Paragraph ellipsis={{ rows: 2 }}>
								{text}
							</Typography.Paragraph>
						</Tooltip>
					);
				},
			},
			{
				title: "Đáp án C",
				dataIndex: "as_c",
				key: "as_c",
				width: 250,
				render: (text) => {
					return (
						<Tooltip title={size(text) > 50 ? text : ""}>
							<Typography.Paragraph ellipsis={{ rows: 2 }}>
								{text}
							</Typography.Paragraph>
						</Tooltip>
					);
				},
			},
			{
				title: "Đáp án D",
				dataIndex: "as_d",
				key: "as_d",
				width: 250,
				render: (text) => {
					return (
						<Tooltip title={size(text) > 50 ? text : ""}>
							<Typography.Paragraph ellipsis={{ rows: 2 }}>
								{text}
							</Typography.Paragraph>
						</Tooltip>
					);
				},
			},
			{
				title: "Đáp án đúng",
				dataIndex: "final",
				key: "final",
			},
			{
				title: "Trạng thái",
				dataIndex: "status",
				key: "status",
				sorter: (a, b) => a.status - b.status,
				render: (value) => {
					let color = value === 1 ? Colors.UFO_GREEN : Colors.TOMATO_RED;
					return (
						<span style={{ color }}>
							{value === 1 ? "Hoạt động" : "Tạm dừng"}
						</span>
					);
				},
			},
			// {
			// 	title: "Thao tác",
			// 	key: "",
			// 	render: (record) => {
			// 		return <Button type={"primary"}>Cập nhật</Button>;
			// 	},
			// },
		];

		return (
			<div>
				<Title level={5}>Thông tin câu hỏi</Title>
				<Row gutter={[10, 10]}>
					<Col span={6}>
						<Select
							style={{ width: "100%" }}
							placeholder={"Chọn chủ đề"}
							value={this.state.topicOption}
							onChange={this.onChangeTopicOption}
						>
							{map(this.state.listOptionTopic, (item) => {
								return (
									<Option key={item.id} value={item.id}>
										{get(item, "name")}
									</Option>
								);
							})}
						</Select>
					</Col>
					<Col span={6}>
						<Select
							value={this.state.questionSetOption}
							style={{ width: "100%" }}
							placeholder={"Chọn đề thi"}
							onChange={this.onChangeQuestionSetOption}
						>
							{map(this.state.listOptionQuestionSet, (item) => {
								return (
									<Option key={item.id} value={item.id}>
										{get(item, "description")}
									</Option>
								);
							})}
						</Select>
					</Col>
					<Col span={12}>
						{/* <Button
							icon={<FilterFilled />}
							type={"primary"}
							style={{ height: 36, marginRight: 15 }}
						>
							LẤY DỮ LIỆU
						</Button> */}
						<Button
							icon={<PlusCircleFilled />}
							type={"primary"}
							style={{ height: 36, marginRight: 15 }}
							onClick={debounce(() => {
								if (this.state.topicOption === null) {
									notification.info({ message: "Chưa chọn chủ đề." });
									return;
								}
								this.openCloseModalAddQuestion();
							}, 300)}
						>
							THÊM CÂU HỎI
						</Button>
					</Col>
				</Row>
				<Table
					loading={this.state.loadingQuestion}
					columns={colums}
					dataSource={this.state.listQuestion}
					style={{ margin: "20px 0px" }}
					pagination={
						this.state.listQuestion.length > 10
							? {
									showSizeChanger: false,
									current: this.state.curPageQuestion,
									onChange: this.onChangePageQuestion,
							  }
							: false
					}
				/>
				<CreateQuestionModal
					listQuestionSet={this.state.listOptionQuestionSet}
					visible={this.state.showModalAddQuestion}
					onCancel={this.openCloseModalAddQuestion}
					onSubmit={this.onSubmitAddQuestion}
				/>
			</div>
		);
	}
}

const mapStateToProp = createStructuredSelector({});

const mapDispatchToProps = (dispatch) => {
	return {
		doGetOptionTopicQuestion: (callbacks) => {
			dispatch(getOptionTopicQuestionAction({}, callbacks));
		},
		doGetOptionQuestionSet: (payload, callbacks) => {
			dispatch(getOptionQuestionSetAction(payload, callbacks));
		},
		doGetListQuestion: (payload, callbacks) => {
			dispatch(getListQuestionAction(payload, callbacks));
		},
		doCreateUpdateQuestionSet: (payload, callbacks) => {
			dispatch(createUpdateQuestionSetAction(payload, callbacks));
		},
		doAddQuestion: (payload, callbacks) => {
			dispatch(handleAddQuestionAction(payload, callbacks));
		},
	};
};

export default connect(mapStateToProp, mapDispatchToProps)(QuestionManager);
