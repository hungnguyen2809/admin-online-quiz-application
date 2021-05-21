import axios from "axios";
import { get } from "lodash";
import queryString from "query-string";
import { getLocalData } from "../services/StoreService";

const isProduct = false;

const BaseAPI = {
	BaseUrl: isProduct
		? `http://${process.env.REACT_APP_IP_HOST_PRODUCT}:${process.env.REACT_APP_IP_PORT}/api`
		: `http://${process.env.REACT_APP_IP_HOST_DEV}:${process.env.REACT_APP_IP_PORT}/api`,
};

const CancelToken = axios.CancelToken;

const instanceAxios = axios.create({
	baseURL: BaseAPI.BaseUrl,
	timeout: 10000,
	timeoutErrorMessage: "Quá thời gian kết nối",
	paramsSerializer: (params) => queryString.stringify(params),
});

let cancelRequest = null;
// Custom request ...
instanceAxios.interceptors.request.use(async (config) => {
	if (cancelRequest) {
		cancelRequest();
	}

	config.cancelToken = cancelRequest;
	return config;
});

// Custom response ...
instanceAxios.interceptors.response.use(
	async (response) => {
		if (response && response.data) {
			return {
				status: response.status,
				...response.data,
			};
		}
		return response;
	},
	async (error) => {
		if (error.response) {
			const { data } = error.response;
			if (get(data, "token_invalid") === true) {
				if (cancelRequest === null) {
					new CancelToken((cancel) => {
						cancelRequest = cancel;
					});
				}
			}
		}
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
