import {
	ACCOUNT_UNREGISTER_TOKEN_REFRESH,
	ADMIN_ACCOUNT_GET_ALL_ACCOUNT,
	ADMIN_ACCOUNT_GET_ALL_ACCOUNT_DONE,
	ADMIN_ACCOUNT_UPDATE_INFO_USER,
	AUTH_ACCOUNT_LOGIN,
	AUTH_ACCOUNT_LOGIN_DONE,
} from "./constants";

export const handleLoginAccountAction = (data, callbacks) => {
	return {
		type: AUTH_ACCOUNT_LOGIN,
		payload: { data },
		callbacks,
	};
};

export const handleLoginAccountActionDone = (data) => {
	return {
		type: AUTH_ACCOUNT_LOGIN_DONE,
		payload: { data },
	};
};

export const getListAllAccountAction = (data, callbacks) => {
	return {
		type: ADMIN_ACCOUNT_GET_ALL_ACCOUNT,
		payload: { data },
		callbacks,
	};
};

export const getListAllAccountActionDone = (data) => {
	return {
		type: ADMIN_ACCOUNT_GET_ALL_ACCOUNT_DONE,
		payload: { data },
	};
};

export const handleUpdateUserInfoAction = (data, callbacks) => {
	return {
		type: ADMIN_ACCOUNT_UPDATE_INFO_USER,
		payload: { data },
		callbacks,
	};
};

export const unregisterRefreshTokenAction = (data, callbacks) => {
	return {
		type: ACCOUNT_UNREGISTER_TOKEN_REFRESH,
		payload: { data },
		callbacks,
	};
};
