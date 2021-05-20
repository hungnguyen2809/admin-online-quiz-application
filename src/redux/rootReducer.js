import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import AccountReducer from "./Account/reducers";

const createRootReducer = (history) => {
	return combineReducers({
		router: connectRouter(history),
		account: AccountReducer,
	});
};

export default createRootReducer;
