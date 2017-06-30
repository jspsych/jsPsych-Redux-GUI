import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import rootReducer from '../common/reducers';
import App from '../common/containers/AppContainer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { signIn } from '../common/containers/Login';
import { getUserInfoFromLocalStorage, fetchCredential } from '../common/backend/cognito';

const preloadedState = window.__PRELOADED_STATE__;

const store = createStore(rootReducer, applyMiddleware(thunk));


window.addEventListener('load', () => {
	fetchCredential();
	let userLoginInfo = getUserInfoFromLocalStorage();
	if (userLoginInfo &&
		userLoginInfo.username &&
		userLoginInfo.identityId) {
		signIn(store.dispatch);
	}
});

injectTapEventPlugin();
ReactDOM.render(
  <Provider store={store}>
	<MuiThemeProvider>
  		<App />
  	</MuiThemeProvider>
  </Provider>,
  document.getElementById('container')
);