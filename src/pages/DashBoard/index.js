import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row } from "antd";
import Title from "antd/lib/typography/Title";
import Card from "../../components/Card";
import { Colors } from "../../constants/Styles";
import { BsFillPersonLinesFill, DiGhostSmall } from "react-icons/all";
import { getInfoDashbroadAction } from "../../redux/DashBroad/actions";
import { get } from "lodash";

class DashBroad extends Component {
	constructor(props) {
		super(props);

		this.state = {
			infoGarenal: {},
		};
	}

	componentDidMount() {
		this.onGetInfoDashBroad();
	}

	onGetInfoDashBroad = () => {
		this.props.doGetInfoDashBroad({
			callbackOnSuccess: (res) => {
				this.setState({ infoGarenal: res });
			},
		});
	};

	render() {
		const layoutRowCol = {
			lg: 6,
			md: 12,
			sm: 24,
			style: { display: "flex", justifyContent: "center" },
		};
		const { infoGarenal } = this.state;
		return (
			<div>
				<Title level={5}>Thông tin chung</Title>
				<br />
				<Row gutter={[10, 10]}>
					<Col {...layoutRowCol}>
						<Card
							bgClolor={Colors.CLEAR_CHILL}
							title={`Tài khoản hoạt động: ${get(
								infoGarenal,
								"number_user",
								0
							)}`}
							description={"Tổng số tài khoản đang hoạt động"}
							icon={<BsFillPersonLinesFill color={"#fff"} size={20} />}
						/>
					</Col>
					<Col {...layoutRowCol}>
						<Card
							bgClolor={Colors.UFO_GREEN}
							title={`Số chủ đề: ${get(infoGarenal, "number_topic", 0)}`}
							description={"Tổng số chủ đề đang hoạt động"}
							icon={<DiGhostSmall color={"#fff"} size={20} />}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = (dispatch) => {
	return {
		doGetInfoDashBroad: (callbacks) => {
			dispatch(getInfoDashbroadAction(callbacks));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBroad);
