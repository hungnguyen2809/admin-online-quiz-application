import AccountSagas from "./Account/sagas";
import DashBroadSaga from "./DashBroad/sagas";

const createRootSaga = [AccountSagas, DashBroadSaga];

export default createRootSaga;
