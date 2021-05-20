import axios from "axios";
import queryString from "query-string";
import "dotenv";
import { getLocalData } from "../services/StoreService";

const isProduct = true;

const BaseAPI = {
	BaseUrl: isProduct
		? `http://${process.env.IP_HOST_PRODUCT}:${process.env.IP_PORT}/api`
		: `http://${process.env.IP_HOST_DEV}:${process.env.IP_PORT}/api`,
};

const instanceAxios = axios.create({
	baseURL: BaseAPI.BaseUrl,
	timeout: 10000,
	timeoutErrorMessage: "Quá thời gian kết nối",
	paramsSerializer: (params) => queryString.stringify(params),
});

// Custom request ...
instanceAxios.interceptors.request.use(async (config) => {
	return config;
});

// Custom response ...
instanceAxios.interceptors.response.use(
	(response) => {
		if (response && response.data) {
			return {
				status: response.status,
				...response.data,
			};
		}
		return response;
	},
	(error) => {
		throw error;
	}
);

const _makeAuthRequest = (instanceRequest) => async (args) => {
	const requestHeaders = args.headers ? args.headers : {};

	const token = getLocalData("access_token");
	const authHeaders = {
		"AuthToken-VTNH": token,
	};

	const options = {
		...args,
		headers: {
			...requestHeaders,
			...authHeaders,
		},
	};

	try {
		return await instanceRequest(options);
	} catch (error) {
		throw error;
	}
};

const _makeNonAuthRequest = (instanceRequest) => async (args) => {
	const requestHeaders = args.headers ? args.headers : {};

	const options = {
		...args,
		headers: {
			...requestHeaders,
		},
	};

	try {
		return await instanceRequest(options);
	} catch (error) {
		throw error;
	}
};

export const apis = {
	makeAuthRequest: _makeAuthRequest(instanceAxios),
	makeNonAuthRequest: _makeNonAuthRequest(instanceAxios),
};
