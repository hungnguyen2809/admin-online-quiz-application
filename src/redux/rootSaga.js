import AccountSagas from "./Account/sagas";
import DashBroadSaga from "./DashBroad/sagas";
import QuestionSaga from "./Question/sagas";
import TopicSaga from "./Topics/sagas";

const createRootSaga = [AccountSagas, DashBroadSaga, TopicSaga, QuestionSaga];

export default createRootSaga;
