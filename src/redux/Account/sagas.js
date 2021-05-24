import { call, fork, put, takeLatest } from "redux-saga/effects";
import { notification } from "antd";
import {
	getListAllAccountAPI,
	handleUpdateUserInfoAPI,
	loginAccountAPI,
} from "../../apis/ApiAccount";
import { setLocalData } from "../../services/StoreService";
import {
	ADMIN_ACCOUNT_GET_ALL_ACCOUNT,
	ADMIN_ACCOUNT_UPDATE_INFO_USER,
	AUTH_ACCOUNT_LOGIN,
} from "./constants";
import { get, isEmpty } from "lodash";
import { FONT_FAMILY } from "../../constants/Styles";
import { getListAllAccountActionDone } from "./actions";
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

function* workGetListAllAccount(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(getListAllAccountAPI, action.payload.data);
		if (
			response.status === 200 &&
			response.error === false &&
			!isEmpty(response.payload)
		) {
			yield put(getListAllAccountActionDone(response.payload));
			yield callbackOnSuccess();
		} else if (
			response.status === 200 &&
			response.error === false &&
			isEmpty(response.payload)
		) {
			yield put(getListAllAccountActionDone([]));
			yield callbackOnSuccess();
			notification.info({
				message: "Thông báo",
				description: "Không có dữ liệu",
				style: { fontFamily: FONT_FAMILY },
			});
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

function* watcherGetListAllAccount() {
	yield takeLatest(ADMIN_ACCOUNT_GET_ALL_ACCOUNT, workGetListAllAccount);
}

function* workUpdateUserInfoAdmin(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(handleUpdateUserInfoAPI, action.payload.data);
		if (response.status === 200 && response.error === false) {
			yield callbackOnSuccess();
			notification.success({
				message: "Thông báo",
				description: "Cập nhật thành công",
			});
		} else {
			notification.success({
				message: "Cập nhật thất bại",
				description: response.message,
			});
		}
	} catch (error) {}
}

function* watcherUpdateUserInfoAdmin() {
	yield takeLatest(ADMIN_ACCOUNT_UPDATE_INFO_USER, workUpdateUserInfoAdmin);
}

export default function* AccountSagas() {
	yield fork(watcherAccountLogin);
	yield fork(watcherGetListAllAccount);
	yield fork(watcherUpdateUserInfoAdmin);
}
