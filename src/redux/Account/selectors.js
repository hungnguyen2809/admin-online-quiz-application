import { createSelector } from "reselect";

const getStateAccount = () => (state) => {
	return state.account;
};

export const accountSelector = () => {
	return createSelector(getStateAccount(), (state) => {
		return state.get("account");
	});
};

export const listAllAccountSelector = () => {
	return createSelector(getStateAccount(), (state) => {
		return state.get("listAllAccount");
	});
};
