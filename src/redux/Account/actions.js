import { AUTH_ACCOUNT_LOGIN, AUTH_ACCOUNT_LOGIN_DONE } from "./constants";

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
