import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../common/reducers';
import App from '../common/containers/AppContainer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { signIn } from '../common/containers/Login';
import { getUserInfoFromCognito, fetchCredential } from '../common/backend/cognito';

const store = createStore(rootReducer, applyMiddleware(thunk));

window.addEventListener('load', () => {
	utils.logins.load({dispatch: store.dispatch});
});

window.addEventListener('beforeunload', (e) => {
	let { userState, experimentState } = store.getState();
	// new 
	if (utils.deepEqual(userState.lastModifiedExperimentState, experimentState)) {
		e.returnValue = true;
		return true;
	}
});


ReactDOM.render(
  <Provider store={store}>
	<MuiThemeProvider>
  		<App />
  	</MuiThemeProvider>
  </Provider>,
  document.getElementById('container')
);
