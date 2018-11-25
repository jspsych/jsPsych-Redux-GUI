import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../common/reducers';
import App from '../common/containers/AppContainer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { listAllProjects, createProjectFor } from '../common/backend/deploy/pavlovia.test.js';

const store = createStore(rootReducer, applyMiddleware(thunk));

window.addEventListener('load', () => {
	utils.commonFlows.load({dispatch: store.dispatch});
});

window.addEventListener('beforeunload', (e) => {
	let { experimentState } = store.getState(); 
	if (utils.commonFlows.hasExperimentChanged(experimentState)) {
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


// listAllProjects().then(d => {
//     let data = new TextDecoder("utf-8").decode(d);
//     console.log(JSON.parse(data))
//     // console.log(data)
// })

createProjectFor().then(d => {
    let data = new TextDecoder("utf-8").decode(d);
    // console.log(JSON.parse(data))
    console.log(data)
})