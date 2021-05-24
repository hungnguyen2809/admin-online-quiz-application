import AccountSagas from "./Account/sagas";
import DashBroadSaga from "./DashBroad/sagas";
import TopicSaga from "./Topics/sagas";

const createRootSaga = [AccountSagas, DashBroadSaga, TopicSaga];

export default createRootSaga;
