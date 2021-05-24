import { fromJS } from "immutable";
import { ADMIN_TOPIC_GET_ALL_TOPIC_DONE } from "./constants";

const initState = fromJS({
	listTopic: [],
});

const TopicReducer = (state = initState, action) => {
	switch (action.type) {
		case ADMIN_TOPIC_GET_ALL_TOPIC_DONE:
			return state.set("listTopic", action.payload.data);
		default:
			return state;
	}
};

export default TopicReducer;
