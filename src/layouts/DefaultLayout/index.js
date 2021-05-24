import React, { Component } from "react";
import { Avatar, Dropdown, Layout, Menu } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
} from "@ant-design/icons";
import jwtDecode from "jwt-decode";
import { getLocalData, setLocalData } from "../../services/StoreService";
import "./DefaultLayout.css";
import Text from "antd/lib/typography/Text";
import { get, map } from "lodash";
import confirm from "antd/lib/modal/confirm";
import { FONT_FAMILY } from "../../constants/Styles";
import SwitcherRouteComponent, { useRoutes } from "./useRoutes";
import { Link } from "react-router-dom";

class DefaultLayout extends Component {
	constructor(props) {
		super(props);

		this.state = {
			collapsed: false,
			activeKey: "/",
		};
	}

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};

	componentDidMount() {
		const url = new URL(window.location.href);
		this.setState({ activeKey: url.pathname });
	}

	doLogout = () => {
		confirm({
			title: "Bạn có chắc muốn đăng xuất ?",
			style: { fontFamily: FONT_FAMILY },
			onOk: () => {
				setLocalData("access_token", "");
				window.location.href = "/login";
			},
		});
	};

	menuAvatar = () => {
		return (
			<Menu>
				<Menu.Item onClick={this.doLogout}>Đăng xuất</Menu.Item>
			</Menu>
		);
	};

	render() {
		const infoAccount = jwtDecode(getLocalData("access_token"));
		return (
			<Layout className="custom-layout">
				<Sider
					trigger={null}
					collapsible
					collapsed={this.state.collapsed}
					breakpoint={"md"}
					onBreakpoint={(broken) => {
						if (broken) {
							this.setState({ collapsed: true });
						} else {
							this.setState({ collapsed: false });
						}
					}}
				>
					<div className="logo" />
					<Menu
						className="menu-sider"
						mode="inline"
						activeKey={this.state.activeKey}
						onClick={({ key }) => {
							this.setState({ activeKey: key });
						}}
					>
						{map(useRoutes, (item) => {
							return (
								<Menu.Item key={item.path} icon={item.icon}>
									{item.name}
									<Link to={item.path} />
								</Menu.Item>
							);
						})}
					</Menu>
				</Sider>
				<Layout className="site-layout">
					<Header className="site-layout-background layout-header">
						{React.createElement(
							this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
							{
								className: "trigger",
								onClick: this.toggle,
							}
						)}
						<div>
							<Dropdown overlay={this.menuAvatar} placement="bottomRight">
								<Avatar
									style={{ marginRight: 13 }}
									size={40}
									icon={<UserOutlined />}
									src={
										get(infoAccount, "image", null)
											? get(infoAccount, "image")
											: undefined
									}
								/>
							</Dropdown>
							<Text style={{ margin: "0px 10px" }}>
								{get(infoAccount, "name")}
							</Text>
						</div>
					</Header>
					<Content
						className="site-layout-background"
						style={{
							margin: "24px 16px",
							padding: 24,
							minHeight: 280,
						}}
					>
						<SwitcherRouteComponent />
					</Content>
				</Layout>
			</Layout>
		);
	}
}

export default DefaultLayout;
