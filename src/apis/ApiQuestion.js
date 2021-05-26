import { apis } from "./createApiService";

export const getTopicOptionQuestionAPI = () => {
	return apis.makeAuthRequest({
		url: "/topics",
		method: "GET",
	});
};

export const getOptionQuestionSetAPI = (args) => {
	return apis.makeAuthRequest({
		url: "/questions-set/get-all",
		method: "GET",
		params: args,
	});
};

export const getListQuestionAPI = (args) => {
	return apis.makeAuthRequest({
		url: "/questions/question-qs",
		method: "GET",
		params: args,
	});
};

export const createUpdateQuestionSetAPI = (args) => {
	return apis.makeAuthRequest({
		url: "/questions-set/create-update",
		method: "POST",
		data: args,
	});
};

export const handleAddQuestionAPI = (args) => {
	return apis.makeAuthRequest({
		url: "/questions/add-question",
		method: "POST",
		data: args,
	});
};
