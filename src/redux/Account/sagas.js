import { call, fork, put, takeLatest } from "redux-saga/effects";
import { notification } from "antd";
import { loginAccountAPI } from "../../apis/ApiAccount";
import { handleLoginAccountActionDone } from "./actions";
import { setLocalData } from "../../services/StoreService";
import { AUTH_ACCOUNT_LOGIN } from "./constants";

function* workAccountLogin(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(loginAccountAPI, action.payload.data);
		if (response.status === 200 && response.error === false) {
			yield put(handleLoginAccountActionDone(response.payload));
			yield setLocalData("access_token", "");
			yield callbackOnSuccess();
		}
	} catch (error) {
		notification.error({
			message: "Đã xảy ra lỗi",
			description: error.message,
		});
	}
}

function* watcherAccountLogin() {
	yield takeLatest(AUTH_ACCOUNT_LOGIN, workAccountLogin);
}

export default function* AccountSagas() {
	yield fork(watcherAccountLogin);
}
