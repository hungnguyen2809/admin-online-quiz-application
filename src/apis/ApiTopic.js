import { apis } from "./createApiService";

export const getListAllTopics = () => {
	return apis.makeAuthRequest({
		url: "/topics",
		method: "GET",
		params: { per: 1 },
	});
};

export const createTopicAPI = (data) => {
	return apis.makeAuthRequest({
		url: "/topics",
		method: "POST",
		data,
	});
};

export const updateTopicAPI = (data) => {
	return apis.makeAuthRequest({
		url: "/topics",
		method: "PUT",
		data,
	});
};
