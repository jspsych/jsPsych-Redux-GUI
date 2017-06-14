import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import rootReducer from './common/reducers';
import App from './common/containers/App';
import TrialForm from './common/containers/TimelineNode/TrialForm';
import TimelineNodeEditorDrawer from './common/containers/TimelineNode/TimelineNodeEditorDrawer';

const store = createStore(rootReducer, applyMiddleware(thunk));

injectTapEventPlugin();
ReactDOM.render(
  <Provider store={store}>
  <App />
  </Provider>,
  document.getElementById('container')
);