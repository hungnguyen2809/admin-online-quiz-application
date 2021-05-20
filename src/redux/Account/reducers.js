import { fromJS } from "immutable";
import { AUTH_ACCOUNT_LOGIN_DONE } from "./constants";

const initState = fromJS({
	account: {},
});

const AccountReducer = (state = initState, action) => {
	switch (action.type) {
		case AUTH_ACCOUNT_LOGIN_DONE:
			return state.set("account");
		default:
			return state;
	}
};

export default AccountReducer;
