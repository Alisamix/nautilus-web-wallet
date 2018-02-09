import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import ledger from './ledger';

export default combineReducers({
  routing: routerReducer,
  ledger,
});
