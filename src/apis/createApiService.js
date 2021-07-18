import axios from "axios";
import queryString from "query-string";
import jwtDecode from "jwt-decode";
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

const instanceAxios = axios.create({
	baseURL: BaseAPI.BaseUrl,
	timeout: 10000,
	timeoutErrorMessage: "Quá thời gian kết nối",
	paramsSerializer: (params) => queryString.stringify(params),
});

// Custom request ...
instanceAxios.interceptors.request.use((config) => {
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
		if (error.response) {
			const { response } = error;
			const { data } = response;
			if (get(data, "token_invalid")) {
				notification.info({
					message: "Thông báo",
					description: "Bạn cần đăng nhập lại",
				});
				setLocalData("access_token", "");
				window.location.reload();
			}
		}
		throw error;
	}
);

let refreshTokenRequest = null;
let tokenAuth = "";
let setTokenStorage = null;
const _makeAuthRequest = (instanceRequest) => async (args) => {
	try {
		const { token, tokenRefresh } = getLocalData("access_token");
		tokenAuth = token;
		const decodeToken = jwtDecode(token);
		const expiresToken = Date.now() / 1000 >= decodeToken.exp;
		if (expiresToken) {
			refreshTokenRequest = refreshTokenRequest
				? refreshTokenRequest
				: apis.makeNonAuthRequest({
						url: "/refresh-token",
						method: "POST",
						data: { id_user: decodeToken.id, token: tokenRefresh },
				  });
			const responseToken = await refreshTokenRequest;
			refreshTokenRequest = null;

			if (responseToken.error === false && responseToken.status === 200) {
				setTokenStorage = setTokenStorage
					? setTokenStorage
					: setLocalData("access_token", responseToken.payload);
				await setTokenStorage;
				setTokenStorage = null;
				tokenAuth = responseToken.payload.token;
			}
		}
		const requestHeaders = args.headers ? args.headers : {};
		const authHeaders = { "AuthToken-VTNH": tokenAuth };

		const options = {
			...args,
			headers: {
				...requestHeaders,
				...authHeaders,
			},
		};

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
