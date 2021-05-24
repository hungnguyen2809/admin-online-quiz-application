import { fromJS } from "immutable";
import {
	ADMIN_ACCOUNT_GET_ALL_ACCOUNT_DONE,
	AUTH_ACCOUNT_LOGIN_DONE,
} from "./constants";

const initState = fromJS({
	account: {},

	listAllAccount: [],
});

const AccountReducer = (state = initState, action) => {
	switch (action.type) {
		case AUTH_ACCOUNT_LOGIN_DONE:
			return state.set("account", action.payload.data);
		case ADMIN_ACCOUNT_GET_ALL_ACCOUNT_DONE:
			return state.set("listAllAccount", action.payload.data);
		default:
			return state;
	}
};

export default AccountReducer;
