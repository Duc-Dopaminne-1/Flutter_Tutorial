import { ActionTypes, IListItemState, IListLoadAction } from './interface';
import { loadFailure, loadSuccess } from './actions';
import { put, select, takeEvery } from 'redux-saga/effects';
import { getListState } from './selector';

function* implementListApi(action: IListLoadAction) {
  try {
    const listState: IListItemState = yield select(getListState(action.payload.listName));
    const { limit, onLoad, pageNumber } = listState;
    const { data, error, entities, canLoadMore } = yield onLoad!({
      pageNumber: action.payload.isRefresh ? 1 : pageNumber,
      ...(limit === 0 ? {} : { limit }),
      ...action.payload.query,
    });
    if (error) {
      yield put(
        loadFailure({
          error,
          listName: action.payload.listName,
        }),
      );
      return;
    }
    if (action.payload.isRefresh) {
      yield put({
        type: 'ENTITIES_INIT',
        payload: entities,
      });
    } else {
      yield put({
        type: 'ENTITIES_UPDATE',
        payload: entities,
      });
    }
    yield put(
      loadSuccess({
        data,
        canLoadMore,
        listName: action.payload.listName,
        isRefresh: action.payload.isRefresh,
      }),
    );
  } catch (error) {
    yield put(
      loadFailure({
        error,
        listName: action.payload.listName,
      }),
    );
  }
}

function* getNewsFeed() {
  yield takeEvery(ActionTypes.LIST_LOAD_REQUEST, implementListApi);
}

export default getNewsFeed;
