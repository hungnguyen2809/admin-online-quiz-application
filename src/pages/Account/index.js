import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Table } from "antd";
import Title from "antd/lib/typography/Title";
import { filter, get, isEmpty, lowerCase, map, size } from "lodash";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import UpdateUserModal from "../../components/Modal/UpdateUserModal";
import { Colors } from "../../constants/Styles";
import {
	getListAllAccountAction,
	handleUpdateUserInfoAction,
} from "../../redux/Account/actions";
import { listAllAccountSelector } from "../../redux/Account/selectors";
import { dateFormat, dateTimeFormat } from "../../utils/common";

class AccountManager extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listAllAccount: [],
			loadingAccount: false,
			curPageAccount: 1,

			textFilter: "",
			listAccountFilter: [],

			showModalUpdate: false,
			dataSourceUpdate: {},
		};
	}

	componentDidMount() {
		this.onGetListAllAccount(1);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			!!nextProps.listAllAccount &&
			this.props.listAllAccount !== nextProps.listAllAccount
		) {
			const mapData = map(nextProps.listAllAccount, (item, index) => {
				return {
					...item,
					key: index + 1,
				};
			}).sort((a, b) => b.permission - a.permission);
			this.setState({ listAllAccount: mapData, loadingAccount: false });
		}
	}

	onGetListAllAccount = (page = 1) => {
		this.setState({ loadingAccount: true, curPageAccount: page });
		const payload = { per: 1 };
		this.props.doGetListAllAccount(payload, {
			callbackOnSuccess: () => {},
		});
	};

	onChangePageAccount = (page) => {
		this.setState({ curPageAccount: page });
	};

	onChangeFilter = (ev) => {
		const textFilter = ev.target.value;
		this.setState({ textFilter }, () => {
			if (!isEmpty(textFilter)) {
				const filterObj = filter(this.state.listAllAccount, (item) => {
					return (
						lowerCase(get(item, "name")).indexOf(lowerCase(textFilter)) >= 0 ||
						lowerCase(get(item, "phone")).indexOf(lowerCase(textFilter)) >= 0 ||
						lowerCase(get(item, "email")).indexOf(lowerCase(textFilter)) >= 0
					);
				}).map((item, index) => {
					return {
						...item,
						key: index + 1,
					};
				});
				this.setState({ listAccountFilter: filterObj, curPageAccount: 1 });
			}
		});
	};

	openCloseModalUpdate = () => {
		this.setState({ showModalUpdate: !this.state.showModalUpdate });
	};

	onSubmitUpdateAccount = (params, cbSuccess = () => {}) => {
		const payload = {
			id: get(params, "id"),
			email: get(params, "email"),
			password: get(params, "passChange"),
			status: get(params, "status"),
			per: get(params, "permission"),
		};
		this.props.doUpdateAccountInfo(payload, {
			callbackOnSuccess: () => {
				this.onGetListAllAccount(this.state.curPageAccount);
				cbSuccess();
			},
		});
	};

	render() {
		const dataSource = isEmpty(this.state.textFilter)
			? this.state.listAllAccount
			: this.state.listAccountFilter;

		const columns = [
			{
				title: "STT",
				dataIndex: "key",
				key: "key",
			},
			{
				title: "Mã tài khoản",
				dataIndex: "id",
				key: "id",
			},
			{
				title: "Họ tên",
				dataIndex: "name",
				key: "name",
			},
			{
				title: "Email",
				dataIndex: "email",
				key: "email",
			},
			{
				title: "Số điện thoại",
				dataIndex: "phone",
				key: "phone",
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
			{
				title: "Quyền",
				dataIndex: "permission",
				key: "permission",
				sorter: (a, b) => a.permission - b.permission,
				render: (value) => {
					let color = value === 1 ? Colors.RED_ORANGE : Colors.DARK_MOUNTAIN;
					return (
						<span style={{ color }}>{value === 1 ? "ADMIN" : "USER"}</span>
					);
				},
			},
			{
				title: "Ngày tạo",
				dataIndex: "date_create",
				key: "date_create",
				render: (value) => {
					return <span>{moment(value).format(dateFormat)}</span>;
				},
			},
			{
				title: "Ngày cập nhật",
				dataIndex: "date_update",
				key: "date_update",
				render: (value) => {
					return <span>{moment(value).format(dateTimeFormat)}</span>;
				},
			},
			{
				title: "Thao tác",
				render: (record) => {
					return (
						<Button
							type={"primary"}
							onClick={() => {
								this.setState(
									{ dataSourceUpdate: record },
									this.openCloseModalUpdate
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
				<Title level={5}>Thông tin tài khoản</Title>
				<Row gutter={[10, 10]}>
					<Col span={8}>
						<Input
							placeholder={"Nhập tên, email, sđt"}
							prefix={<SearchOutlined />}
							style={{ color: "#dcdcdc", width: "100%", height: 36 }}
							onChange={this.onChangeFilter}
						/>
					</Col>
				</Row>
				<Table
					loading={this.state.loadingAccount}
					style={{ margin: "20px 0px" }}
					columns={columns}
					dataSource={dataSource}
					pagination={
						size(dataSource) > 10
							? {
									showSizeChanger: false,
									current: this.state.curPageAccount,
									onChange: this.onChangePageAccount,
							  }
							: false
					}
				/>
				<UpdateUserModal
					visible={this.state.showModalUpdate}
					dataSource={this.state.dataSourceUpdate}
					onCancel={this.openCloseModalUpdate}
					onSubmit={this.onSubmitUpdateAccount}
				/>
			</div>
		);
	}
}

const mapStateToProps = createStructuredSelector({
	listAllAccount: listAllAccountSelector(),
});

const mapDispatchToProps = (dispatch) => {
	return {
		doGetListAllAccount: (payload, callbacks) => {
			dispatch(getListAllAccountAction(payload, callbacks));
		},
		doUpdateAccountInfo: (payload, callbacks) => {
			dispatch(handleUpdateUserInfoAction(payload, callbacks));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountManager);
