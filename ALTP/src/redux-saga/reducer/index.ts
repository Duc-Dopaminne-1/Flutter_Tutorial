import { combineReducers } from 'redux'
import { counterReducers } from '@/redux-saga/reducer/CounterReducers'

export const allReducers = combineReducers({
  counterReducers: counterReducers
})
