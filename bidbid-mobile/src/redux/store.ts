import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';
import rootSaga from './sagas';

let middlewaresToApply = [];

const sagaMiddleware = createSagaMiddleware();
middlewaresToApply.push(sagaMiddleware);
let enhancer;

if (__DEV__) {
  const createFlipper = require('redux-flipper').default;
  middlewaresToApply.push(createFlipper());
  enhancer = composeWithDevTools(applyMiddleware(...middlewaresToApply));
} else {
  enhancer = applyMiddleware(sagaMiddleware);
}

const store = createStore(reducer, enhancer);

sagaMiddleware.run(rootSaga);

export default store;
