import { apis } from "./createApiService";

export const uploadImageAPI = (args) => {
	return apis.makeAuthRequest({
		url: "/upload-image",
		data: args,
		method: "POST",
	});
};
