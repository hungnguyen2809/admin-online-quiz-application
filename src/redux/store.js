import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleWare from "redux-saga";
import createRootReducer from "./rootReducer";
import createRootSaga from "./rootSaga";

export const history = createBrowserHistory();
const sagaMiddleWare = createSagaMiddleWare();

const middleWare = [];
middleWare.push(routerMiddleware(history));
middleWare.push(sagaMiddleWare);

const store = createStore(
	createRootReducer(history),
	{},
	compose(applyMiddleware(...middleWare))
);

createRootSaga.map(sagaMiddleWare.run);

export default store;
