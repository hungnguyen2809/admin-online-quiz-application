import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import AccountReducer from "./Account/reducers";
import TopicReducer from "./Topics/reducers";

const createRootReducer = (history) => {
	return combineReducers({
		router: connectRouter(history),
		account: AccountReducer,
		topics: TopicReducer,
	});
};

export default createRootReducer;
