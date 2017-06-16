import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import rootReducer from '../common/reducers';
import App from '../common/containers/AppContainer';

const preloadedState = window.__PRELOADED_STATE__;


const store = createStore(rootReducer, applyMiddleware(thunk));


injectTapEventPlugin();
ReactDOM.render(
  <Provider store={store}>
  	<App />
  </Provider>,
  document.getElementById('container')
);