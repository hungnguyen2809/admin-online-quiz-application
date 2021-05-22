import { apis } from "./createApiService";

export const getInfoDashbroadAPI = () => {
	return apis.makeAuthRequest({
		url: "/info-dashbroad",
		method: "GET",
	});
};
