import {
	ADMIN_QUESTON_GET_OPTION_QUESTION_SET,
	ADMIN_QUESTON_GET_OPTION_TOPIC,
	ADMIN_QUESTON_GET_LIST_QUESTION,
	ADMIN_QUESTON_CREATE_UPDATE_QUESTION_SET,
	ADMIN_QUESTON_ADD_QUESTION,
} from "./constants";

export const getOptionTopicQuestionAction = (data, callbacks) => {
	return {
		type: ADMIN_QUESTON_GET_OPTION_TOPIC,
		payload: { data },
		callbacks,
	};
};

export const getOptionQuestionSetAction = (data, callbacks) => {
	return {
		type: ADMIN_QUESTON_GET_OPTION_QUESTION_SET,
		payload: { data },
		callbacks,
	};
};

export const getListQuestionAction = (data, callbacks) => {
	return {
		type: ADMIN_QUESTON_GET_LIST_QUESTION,
		payload: { data },
		callbacks,
	};
};

export const createUpdateQuestionSetAction = (data, callbacks) => {
	return {
		type: ADMIN_QUESTON_CREATE_UPDATE_QUESTION_SET,
		payload: { data },
		callbacks,
	};
};

export const handleAddQuestionAction = (data, callbacks) => {
	return {
		type: ADMIN_QUESTON_ADD_QUESTION,
		payload: { data },
		callbacks,
	};
};
