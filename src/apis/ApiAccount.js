import { apis } from "./createApiService";

export const loginAccountAPI = (args) => {
	return apis.makeNonAuthRequest({
		url: "/adminlogin",
		method: "POST",
		data: args,
	});
};
