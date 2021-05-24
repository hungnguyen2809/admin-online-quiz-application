import { createSelector } from "reselect";

const stateTopic = () => (state) => {
	return state.topics;
};

export const getListTopicSelector = () => {
	return createSelector(stateTopic(), (state) => {
		return state.get("listTopic");
	});
};
