import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Button, Col, Image, Input, Row, Table } from "antd";
import { PlusCircleFilled, SearchOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import {
	getAllTopicAction,
	handleCreateTopic,
	handleUpdateTopic,
} from "../../redux/Topics/actions";
import { getListTopicSelector } from "../../redux/Topics/selectors";
import { debounce, filter, get, isEmpty, lowerCase, map, size } from "lodash";
import { Colors } from "../../constants/Styles";
import TopicModal from "../../components/Modal/TopicModal";
import UpdateTopicModal from "../../components/Modal/UpdateTopicModal";
import { uploadImageAPI } from "../../apis/ApiCommon";

class TopicManager extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listTopics: [],
			loadingTopic: false,
			curPageTopic: 1,

			showModalAdd: false,
			showModalUpdate: false,
			dataTopicUpdate: {},

			textFilter: "",
			listTopicsFilter: [],
		};
	}

	componentDidMount() {
		this.onGetListTopic();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			!!nextProps.listTopics &&
			this.props.listTopics !== nextProps.listTopics
		) {
			const mapData = map(nextProps.listTopics, (item, index) => {
				return {
					...item,
					key: index + 1,
				};
			});
			this.setState({ listTopics: mapData, loadingTopic: false });
		}
	}

	onGetListTopic = () => {
		this.setState({ loadingTopic: true, curPageTopic: 1 });
		this.props.doGetListAllTopic();
	};

	onChangePageTopic = (page) => {
		this.setState({ curPageTopic: page });
	};

	openCloseModalAddTopic = () => {
		this.setState({ showModalAdd: !this.state.showModalAdd });
	};

	openCloseModalUpdateTopic = () => {
		this.setState({ showModalUpdate: !this.state.showModalUpdate });
	};

	onSubmitCreateTopic = async (params, cbSuccess = () => {}) => {
		const formData = new FormData();
		formData.append("file", get(params, "image"));

		const response = await uploadImageAPI(formData);
		if (response.status === 200 && response.error === false) {
			const payload = {
				image: response.payload,
				name: get(params, "nameTopic"),
				description: get(params, "desTopic"),
			};
			this.props.doCreateTopic(payload, {
				callbackOnSuccess: () => {
					this.onGetListTopic();
					cbSuccess();
				},
			});
		}
	};

	onSubmitUpdateTopic = async (params, imageFile, cbSuccess = () => {}) => {
		if (imageFile) {
			const formData = new FormData();
			formData.append("file", imageFile);
			const response = await uploadImageAPI(formData);
			if (response.status === 200 && response.error === false) {
				const payload = {
					...params,
					image: response.payload,
				};
				this.props.doUpdateTopic(payload, {
					callbackOnSuccess: () => {
						this.onGetListTopic();
						cbSuccess();
					},
				});
			}
		} else {
			this.props.doUpdateTopic(params, {
				callbackOnSuccess: () => {
					this.onGetListTopic();
					cbSuccess();
				},
			});
		}
	};

	onChangeFilter = (ev) => {
		const textFilter = ev.target.value;
		this.setState({ textFilter }, () => {
			if (!isEmpty(textFilter)) {
				const filterObj = filter(this.state.listTopics, (item) => {
					return (
						lowerCase(get(item, "name")).indexOf(lowerCase(textFilter)) >= 0
					);
				}).map((item, index) => {
					return {
						...item,
						key: index + 1,
					};
				});
				this.setState({ listTopicsFilter: filterObj, curPageTopic: 1 });
			}
		});
	};

	render() {
		const dataSource = isEmpty(this.state.textFilter)
			? this.state.listTopics
			: this.state.listTopicsFilter;

		const columns = [
			{
				title: "STT",
				dataIndex: "key",
				key: "key",
			},
			{
				title: "Mã chủ đề",
				dataIndex: "id",
				key: "id",
			},
			{
				title: "Tên chủ đề",
				dataIndex: "name",
				key: "name",
			},
			{
				title: "Mô tả",
				dataIndex: "description",
				key: "description",
			},
			{
				title: "Hình ảnh",
				dataIndex: "image",
				key: "image",
				render: (value, record) => {
					return (
						<Image
							style={{ width: 80, height: 80 }}
							src={value}
							alt={get(record, "name")}
						/>
					);
				},
			},
			{
				title: "Trạng thái",
				dataIndex: "status",
				key: "status",
				render: (value) => {
					let color = value === 1 ? Colors.UFO_GREEN : Colors.TOMATO_RED;
					return (
						<span style={{ color }}>
							{value === 1 ? "Hoạt động" : "Tạm dừng"}
						</span>
					);
				},
			},
			{
				title: "Ngày cập nhật",
				dataIndex: "date_update",
				key: "date_update",
			},
			{
				title: "Thao tác",
				render: (record) => {
					return (
						<Button
							type={"primary"}
							onClick={() => {
								this.setState(
									{ dataTopicUpdate: record },
									this.openCloseModalUpdateTopic
								);
							}}
						>
							Cập nhật
						</Button>
					);
				},
			},
		];

		return (
			<div>
				<Title level={5}>Thông tin chủ đề</Title>
				<Row gutter={[10, 10]}>
					<Col span={6}>
						<Input
							placeholder={"Nhập tên chủ đề"}
							prefix={<SearchOutlined />}
							style={{ color: "#dcdcdc", width: "100%", height: 36 }}
							onChange={this.onChangeFilter}
						/>
					</Col>
					<Col span={18}>
						{/* <Button
							icon={<FilterFilled />}
							type={"primary"}
							style={{ height: 36, marginRight: 15 }}
						>
							TÌM KIẾM
						</Button> */}
						<Button
							icon={<PlusCircleFilled />}
							type={"primary"}
							style={{ height: 36, marginRight: 15 }}
							onClick={debounce(this.openCloseModalAddTopic, 300)}
						>
							THÊM MỚI
						</Button>
					</Col>
				</Row>
				<Table
					loading={this.state.loadingTopic}
					style={{ margin: "20px 0px" }}
					columns={columns}
					dataSource={dataSource}
					pagination={
						size(dataSource) > 5
							? {
									pageSize: 5,
									showSizeChanger: false,
									current: this.state.curPageTopic,
									onChange: this.onChangePageTopic,
							  }
							: false
					}
				/>
				<TopicModal
					visible={this.state.showModalAdd}
					onCancel={this.openCloseModalAddTopic}
					onSubmit={this.onSubmitCreateTopic}
				/>
				<UpdateTopicModal
					visible={this.state.showModalUpdate}
					onCancel={this.openCloseModalUpdateTopic}
					dataSource={this.state.dataTopicUpdate}
					onSubmit={this.onSubmitUpdateTopic}
				/>
			</div>
		);
	}
}

const mapStateToProps = createStructuredSelector({
	listTopics: getListTopicSelector(),
});

const mapDispatchToProps = (dispatch) => {
	return {
		doGetListAllTopic: (callback = { callbackOnSuccess: () => {} }) => {
			dispatch(getAllTopicAction(callback));
		},
		doCreateTopic: (payload, callbacks) => {
			dispatch(handleCreateTopic(payload, callbacks));
		},
		doUpdateTopic: (payload, callbacks) => {
			dispatch(handleUpdateTopic(payload, callbacks));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicManager);