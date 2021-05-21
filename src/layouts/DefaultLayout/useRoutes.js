import {
	FolderOpenFilled,
	IdcardFilled,
	PieChartFilled,
	SignalFilled,
} from "@ant-design/icons";
import AccountManager from "../../pages/Account";
import DashBroad from "../../pages/DashBoard";
import TopicManager from "../../pages/Topic";
import QuestionManager from "../../pages/Questions";
import { Route } from "react-router";

export const useRoutes = [
	{
		path: "/",
		name: "Trang chủ",
		exact: true,
		component: DashBroad,
		icon: <PieChartFilled />,
	},
	{
		path: "/topics",
		name: "Chủ đề",
		component: TopicManager,
		icon: <SignalFilled />,
	},
	{
		path: "/questions",
		name: "Câu hỏi",
		component: QuestionManager,
		icon: <FolderOpenFilled />,
	},
	{
		path: "/accounts",
		name: "Tài khoản",
		component: AccountManager,
		icon: <IdcardFilled />,
	},
];

const SwitcherRouteComponent = () => {
	return useRoutes.map((route, idx) => {
		return (
			<Route
				key={idx}
				path={route.path}
				exact={route.exact}
				component={route.component}
			/>
		);
	});
};

export default SwitcherRouteComponent;
