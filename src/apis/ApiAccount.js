import { apis } from "./createApiService";

export const loginAccountAPI = (args) => {
	return apis.makeNonAuthRequest({
		url: "/adminlogin",
		method: "POST",
		data: args,
	});
};

export const getListAllAccountAPI = (args) => {
	return apis.makeAuthRequest({
		url: "/users-all",
		method: "GET",
		params: args,
	});
};

export const handleUpdateUserInfoAPI = (args) => {
	return apis.makeAuthRequest({
		url: "/users/update-info-admin",
		method: "POST",
		data: args,
	});
};
