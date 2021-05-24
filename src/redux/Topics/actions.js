import {
	ADMIN_TOPIC_ADD_NEW_TOPIC,
	ADMIN_TOPIC_GET_ALL_TOPIC,
	ADMIN_TOPIC_GET_ALL_TOPIC_DONE,
	ADMIN_TOPIC_UPDATE_TOPIC,
} from "./constants";

export const getAllTopicAction = (callbacks) => {
	return {
		type: ADMIN_TOPIC_GET_ALL_TOPIC,
		payload: {},
		callbacks,
	};
};

export const getAllTopicActionDone = (data) => {
	return {
		type: ADMIN_TOPIC_GET_ALL_TOPIC_DONE,
		payload: { data },
	};
};

export const handleCreateTopic = (data, callbacks) => {
	return {
		type: ADMIN_TOPIC_ADD_NEW_TOPIC,
		payload: { data },
		callbacks,
	};
};

export const handleUpdateTopic = (data, callbacks) => {
	return {
		type: ADMIN_TOPIC_UPDATE_TOPIC,
		payload: { data },
		callbacks,
	};
};
