//takeEvery khi thực hiện một hành động nào đó nó sẻ gọi một hàm trước khi dispatch vào reducers
import { takeEvery, takeLatest, call } from 'redux-saga/effects'
import { SIGNUP } from '@/redux-saga/actions/actionTypes'
import { signUpService } from '@/redux-saga/service/index'

function* signUp(action: any) {
  const { onSuccess, onFail } = action.payload
  try {
    const { response, error } = yield call(signUpService)

    return 2
  } catch (error) {
    return { error }
  }
}

function* Saga() {
  yield takeLatest(SIGNUP, signUp)
}

export default Saga
