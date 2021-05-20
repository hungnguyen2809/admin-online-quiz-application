import React, { Component } from "react";
import store, { history } from "./redux/store";
import "antd/dist/antd.css";
import { BrowserRouter, Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";
import Login from "./pages/Login";
import ErrorPage from "./layouts/ErrorLayout";
import PrivateRoute from "./components/PrivateRoute";
import DefaultLayout from "./layouts/DefaultLayout";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<ConfigProvider locale={viVN}>
				<Provider store={store}>
					<ConnectedRouter history={history}>
						<Router history={history}>
							<BrowserRouter>
								<Switch>
									<Route path={"/login"} component={Login} />
									<Route path={"/404"} component={ErrorPage} />
									<PrivateRoute path={"/"} component={DefaultLayout} />
								</Switch>
							</BrowserRouter>
						</Router>
					</ConnectedRouter>
				</Provider>
			</ConfigProvider>
		);
	}
}

export default App;
