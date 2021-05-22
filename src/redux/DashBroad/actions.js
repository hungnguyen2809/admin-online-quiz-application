import { DASHBROAD_GET_INFO_DASHBROAD } from "./constants";

export const getInfoDashbroadAction = (callbacks) => {
	return {
		type: DASHBROAD_GET_INFO_DASHBROAD,
		payload: {},
		callbacks,
	};
};
