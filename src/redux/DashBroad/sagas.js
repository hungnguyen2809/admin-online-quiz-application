import { call, fork, takeLatest } from "@redux-saga/core/effects";
import { notification } from "antd";
import { getInfoDashbroadAPI } from "../../apis/ApiDashBroad";
import { FONT_FAMILY } from "../../constants/Styles";
import { DASHBROAD_GET_INFO_DASHBROAD } from "./constants";

function* workGetInfoDashBroad(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(getInfoDashbroadAPI);
		yield callbackOnSuccess(response.payload);
	} catch (error) {
		if (error.response) {
			notification.error({
				message: "Đã xảy ra lỗi",
				description: JSON.stringify(error.response.data),
				style: { fontFamily: FONT_FAMILY },
			});
		} else {
			notification.error({
				message: "Đã xảy ra lỗi",
				description: error.message,
				style: { fontFamily: FONT_FAMILY },
			});
		}
	}
}

function* watcherGetInfoDashBroad() {
	yield takeLatest(DASHBROAD_GET_INFO_DASHBROAD, workGetInfoDashBroad);
}

export default function* DashBroadSaga() {
	yield fork(watcherGetInfoDashBroad);
}
