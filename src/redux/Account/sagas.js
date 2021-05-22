import { call, fork, takeLatest } from "redux-saga/effects";
import { notification } from "antd";
import { loginAccountAPI } from "../../apis/ApiAccount";
import { setLocalData } from "../../services/StoreService";
import { AUTH_ACCOUNT_LOGIN } from "./constants";
import { get } from "lodash";
import { FONT_FAMILY } from "../../constants/Styles";
// import { handleLoginAccountActionDone } from "./actions";

function* workAccountLogin(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(loginAccountAPI, action.payload.data);
		if (response.status === 200 && response.error === false) {
			// yield put(handleLoginAccountActionDone(response.payload));
			yield setLocalData("access_token", get(response.payload, "token"));
			yield callbackOnSuccess();
		} else {
			notification.error({
				message: "Thông báo",
				description: response.message,
				style: { fontFamily: FONT_FAMILY },
			});
		}
	} catch (error) {
		notification.error({
			message: "Đã xảy ra lỗi",
			description: error.message,
			style: { fontFamily: FONT_FAMILY },
		});
	}
}

function* watcherAccountLogin() {
	yield takeLatest(AUTH_ACCOUNT_LOGIN, workAccountLogin);
}

export default function* AccountSagas() {
	yield fork(watcherAccountLogin);
}
