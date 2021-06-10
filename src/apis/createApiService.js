import axios from "axios";
import queryString from "query-string";
import get from "lodash/get";
import { getLocalData, setLocalData } from "../services/StoreService";
import { notification } from "antd";

const isProduct = false;

const BaseAPI = {
	BaseUrlImage: "https://api.cloudinary.com/v1_1/hungnguyen2809/image/upload",
	BaseUrl: isProduct
		? "https://server-online-quiz.herokuapp.com/api"
		: `http://${process.env.REACT_APP_IP_HOST_DEV}:${process.env.REACT_APP_IP_PORT_DEV}/api`,
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
	return config;
});

// Custom response ...
instanceAxios.interceptors.response.use(
	async (response) => {
		if (cancelRequest) {
			cancelRequest = null;
		}
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
			const { response } = error;
			const { data } = response;

			if (response.status === 400) {
				if (get(data, "token_invalid") === true) {
					if (cancelRequest === null) {
						new CancelToken((cancel) => {
							cancelRequest = cancel;
						});
						setLocalData("access_token", "");
						window.location.reload();
					}
					return { data };
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

export const makeUploadImage = async (imageFile) => {
	try {
		if (typeof imageFile !== "object") {
			notification.error({
				message: "Thông báo",
				description: "Chưa có file ảnh.",
			});
			return;
		}

		const uploadPreset = isProduct
			? "online-quiz-topics"
			: "online-quiz-dev-topics";
		const formData = new FormData();
		formData.append("cloud_name", "hungnguyen2809");
		formData.append("upload_preset", uploadPreset);
		formData.append("file", imageFile);

		const response = await axios.post(BaseAPI.BaseUrlImage, formData);
		return {
			...response.data,
		};
	} catch (error) {
		if (error.response) {
			const { response } = error;
			notification.error({
				message: "Đã xảy ra lôi",
				description: get(response, "data.error.message", ""),
			});
			return;
		}
		throw error;
	}
};
