import { notification } from "antd";
import { isEmpty } from "lodash";
import { call, fork, takeLatest } from "redux-saga/effects";
import {
	createUpdateQuestionSetAPI,
	getListQuestionAPI,
	getOptionQuestionSetAPI,
	getTopicOptionQuestionAPI,
	handleAddQuestionAPI,
} from "../../apis/ApiQuestion";
import { FONT_FAMILY } from "../../constants/Styles";
import { multiDataCreatedOrDeleted } from "../../services/mothodService";
import {
	ADMIN_QUESTON_ADD_QUESTION,
	ADMIN_QUESTON_CREATE_UPDATE_QUESTION_SET,
	ADMIN_QUESTON_GET_LIST_QUESTION,
	ADMIN_QUESTON_GET_OPTION_QUESTION_SET,
	ADMIN_QUESTON_GET_OPTION_TOPIC,
} from "./constants";

function* workGetTopicOption(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(getTopicOptionQuestionAPI);
		if (
			response.error === false &&
			response.status === 200 &&
			!isEmpty(response.payload)
		) {
			yield callbackOnSuccess(response.payload);
		} else if (
			response.error === false &&
			response.status === 200 &&
			isEmpty(response.payload)
		) {
			yield callbackOnSuccess([]);
			notification.info({
				message: "Thông báo",
				description: "Không có dữ liệu chủ đề hoạt động",
				style: { fontFamily: FONT_FAMILY },
			});
		} else {
			notification.info({
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

function* watcherGetTopicOption() {
	yield takeLatest(ADMIN_QUESTON_GET_OPTION_TOPIC, workGetTopicOption);
}

function* workGetOptionQuestionSet(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(getOptionQuestionSetAPI, action.payload.data);
		if (
			response.error === false &&
			response.status === 200 &&
			!isEmpty(response.payload)
		) {
			yield callbackOnSuccess(response.payload);
		} else if (
			response.error === false &&
			response.status === 200 &&
			isEmpty(response.payload)
		) {
			yield callbackOnSuccess([]);
			notification.info({
				message: "Thông báo",
				description: "Không có dữ liệu đề thi hoạt động",
				style: { fontFamily: FONT_FAMILY },
			});
		} else {
			notification.info({
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

function* watcherGetOptionQuestionSet() {
	yield takeLatest(
		ADMIN_QUESTON_GET_OPTION_QUESTION_SET,
		workGetOptionQuestionSet
	);
}

function* workGetListQuestion(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(getListQuestionAPI, action.payload.data);
		if (
			response.error === false &&
			response.status === 200 &&
			!isEmpty(response.payload)
		) {
			yield callbackOnSuccess(response.payload);
		} else if (
			response.error === false &&
			response.status === 200 &&
			isEmpty(response.payload)
		) {
			yield callbackOnSuccess([]);
			notification.info({
				message: "Thông báo",
				description: "Không có dữ liệu câu hỏi",
				style: { fontFamily: FONT_FAMILY },
			});
		} else {
			notification.info({
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

function* watcherGetListQuestion() {
	yield takeLatest(ADMIN_QUESTON_GET_LIST_QUESTION, workGetListQuestion);
}

function* workCreateUpdateQuestionSet(action) {
	const { callbackOnSuccess } = action.callbacks;
	try {
		const response = yield call(
			createUpdateQuestionSetAPI,
			action.payload.data
		);
		if (
			response.error === false &&
			response.status === 200 &&
			!isEmpty(response.payload)
		) {
			yield callbackOnSuccess(response.payload);
		} else {
			notification.info({
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

function* watcherCreateUpdateQuestionSet() {
	yield takeLatest(
		ADMIN_QUESTON_CREATE_UPDATE_QUESTION_SET,
		workCreateUpdateQuestionSet
	);
}

function* workAddQuestion(action) {
	// const { callbackOnSuccess } = action.callbacks;
	try {
		// const response = yield call(handleAddQuestionAPI, action.payload.data);
		// if (response.error === false && response.status === 200) {
		// 	yield callbackOnSuccess(response.payload);
		// } else {
		// 	notification.info({
		// 		message: "Thông báo",
		// 		description: response.message,
		// 		style: { fontFamily: FONT_FAMILY },
		// 	});
		// }
		yield multiDataCreatedOrDeleted(
			handleAddQuestionAPI,
			action.payload.data,
			action.callbacks
		);
	} catch (error) {
		notification.error({
			message: "Đã xảy ra lỗi",
			description: error.message,
			style: { fontFamily: FONT_FAMILY },
		});
	}
}

function* watcherAddQuestion() {
	yield takeLatest(ADMIN_QUESTON_ADD_QUESTION, workAddQuestion);
}

export default function* QuestionSaga() {
	yield fork(watcherGetTopicOption);
	yield fork(watcherGetOptionQuestionSet);
	yield fork(watcherGetListQuestion);
	yield fork(watcherCreateUpdateQuestionSet);
	yield fork(watcherAddQuestion);
}
