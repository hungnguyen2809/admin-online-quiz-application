import { apis } from "./createApiService";

export const loginAccountAPI = (args) => {
	return apis.makeNonAuthRequest({
		url: "",
		method: "POST",
		data: args,
	});
};
