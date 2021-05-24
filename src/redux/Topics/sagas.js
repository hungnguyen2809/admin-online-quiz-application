import { call, fork, put, takeLatest } from "redux-saga/effects";
import { notification } from "antd";
import { isEmpty } from "lodash";
import {
	createTopicAPI,
	getListAllTopics,
	updateTopicAPI,
} from "../../apis/ApiTopic";
import { FONT_FAMILY } from "../../constants/Styles";
import { getAllTopicActionDone } from "./actions";
import {
	ADMIN_TOPIC_ADD_NEW_TOPIC,
	ADMIN_TOPIC_GET_ALL_TOPIC,
	ADMIN_TOPIC_UPDATE_TOPIC,
} from "./constants";

function* workGetListAllTopic(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(getListAllTopics);
		if (
			response.status === 200 &&
			response.error === false &&
			!isEmpty(response.payload)
		) {
			yield put(getAllTopicActionDone(response.payload));
			yield callbackOnSuccess();
		} else if (
			response.status === 200 &&
			response.error === false &&
			isEmpty(response.payload)
		) {
			yield put(getAllTopicActionDone([]));
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

function* watcherGetListAllTopic() {
	yield takeLatest(ADMIN_TOPIC_GET_ALL_TOPIC, workGetListAllTopic);
}

function* workCreateTopic(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(createTopicAPI, action.payload.data);
		if (response.status === 200 && response.error === false) {
			yield callbackOnSuccess();
			notification.success({
				message: "Thông báo",
				description: "Thêm mới thành công",
				style: { fontFamily: FONT_FAMILY },
			});
		} else {
			notification.error({
				message: "Thêm mới thất bại",
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

function* watcherCreateTopic() {
	yield takeLatest(ADMIN_TOPIC_ADD_NEW_TOPIC, workCreateTopic);
}

function* workUpdateTopic(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(updateTopicAPI, action.payload.data);
		if (response.status === 200 && response.error === false) {
			yield callbackOnSuccess();
			notification.success({
				message: "Thông báo",
				description: "Cập nhật thành công",
				style: { fontFamily: FONT_FAMILY },
			});
		} else {
			notification.error({
				message: "Cập nhật thất bại",
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

function* watcherUpdateTopic() {
	yield takeLatest(ADMIN_TOPIC_UPDATE_TOPIC, workUpdateTopic);
}

export default function* TopicSaga() {
	yield fork(watcherGetListAllTopic);
	yield fork(watcherCreateTopic);
	yield fork(watcherUpdateTopic);
}
