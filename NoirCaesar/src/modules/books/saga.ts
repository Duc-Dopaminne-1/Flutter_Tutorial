import * as BookServices from './service';
import * as CommentServices from '../comment/service';
import { call, takeLatest, put, takeEvery } from 'redux-saga/effects';
import { isNetworkAvailable } from '../network/actions';
import {
  ActionTypes,
  IActionGetList,
  IActionGetBook,
  IActionGetListChapter,
  IActionGetGenres,
  IActionCreateBook,
  IActionGetChapter,
  IActionPurchaseChapter,
  IActionGetListComment,
  IActionCreateComment
} from './index';
import {
  saveListAZ,
  saveListChapter,
  saveGenres,
  savePopular,
  loadMorePopular,
  saveBook,
  loadMoreListAZ,
  saveListBookGenres,
  loadMoreListBookGenres,
  loadMoreListChapter, saveListComment,
  loadMoreListComment
} from './actions';
import { BookListModeEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book';
import NavigationActionsService from '@src/navigation/navigation';
import { ModelEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment';

function* getList(action: IActionGetList) {
  const { onSuccess, onFail, mode, limit, page, genres_id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(BookServices.getList, mode, genres_id, page, limit);
  if (!error) {
    switch (mode) {
      case BookListModeEnum.Popular:
        if (page == 1) {
          yield put(savePopular({ results: result }));
        } else {
          yield put(loadMorePopular({ results: result }));
        }
        break;
      case BookListModeEnum.Genres:
        if (page == 1) {
          yield put(saveListBookGenres({ books: result }));
        } else {
          yield put(loadMoreListBookGenres({ books: result }));
        }
        break;
      case BookListModeEnum.Az:
        if (page === 1) {
          yield put(saveListAZ({ results: result }));
        } else {
          yield put(loadMoreListAZ({ results: result }));
        }
        break;
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* getBook(action: IActionGetBook) {
  const { onSuccess, onFail, book_id, is_collection } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(BookServices.getBook, book_id, is_collection);

  if (!error) {
    // yield put(saveBook({ book_id, book: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* getListChapter(action: IActionGetListChapter) {
  const { onSuccess, onFail, book_id, limit, page, is_collection } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(BookServices.getlistChapter, book_id, page, limit, is_collection);
  if (!error) {
    // if (page == 1) {
    //   yield put(saveListChapter({ book_id, results: result }));
    // } else {
    //   yield put(loadMoreListChapter({ book_id, results: result }));
    // }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* getListGenres(action: IActionGetGenres) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(BookServices.getGenres);
  if (!error) {
    yield put(saveGenres({ results: result }));
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* createBook(action: IActionCreateBook) {
  const { onSuccess, onFail, data } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(BookServices.createBook, data);
  if (!error) {
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* getChapter(action: IActionGetChapter) {
  const { onSuccess, onFail, chapterId, is_collection } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(BookServices.getChapter, chapterId, is_collection);

  if (!error) {
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* purchaseChapter(action: IActionPurchaseChapter) {
  const { onSuccess, onFail, chapter_id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(BookServices.purchaseChapter, chapter_id);
  if (!error) {
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* getListComment(action: IActionGetListComment) {
  const { onSuccess, onFail, model_id, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(CommentServices.getList, ModelEnum.Book, model_id, page, limit);

  if (!error) {
    // if (page == 1) {
    //   yield put(saveListComment({ book_id: model_id, results: result }));
    // } else {
    //   yield put(loadMoreListComment({ book_id: model_id, results: result }));
    // }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* createComment(action: IActionCreateComment) {
  const { onSuccess, onFail, model_id, text } = action.payload;
  const isConnected = yield isNetworkAvailable();
  NavigationActionsService.showLoading();
  if (!isConnected) {
    setTimeout(() => {
      onFail && onFail();
      NavigationActionsService.hideLoading();
    }, 500);
    return;
  }
  const { result, error } = yield call(CommentServices.createComment, ModelEnum.Book, model_id, text);
  if (!error) {
    yield put(saveListComment({ book_id: model_id, results: result }));
    setTimeout(() => {
      NavigationActionsService.hideLoading();
      onSuccess && onSuccess(result);
    }, 500);
  } else if (onFail) {
    setTimeout(() => {
      NavigationActionsService.hideLoading();
      onFail && onFail(error);
    }, 500);
  }
}

function* booksSaga() {
  yield takeEvery(ActionTypes.GET_LIST, getList);
  yield takeLatest(ActionTypes.GET_BOOK, getBook);
  yield takeLatest(ActionTypes.GET_LIST_CHAPTER, getListChapter);
  yield takeLatest(ActionTypes.GET_GENRES, getListGenres);
  yield takeLatest(ActionTypes.CREATE_BOOK, createBook);
  yield takeLatest(ActionTypes.GET_CHAPTER, getChapter);
  yield takeLatest(ActionTypes.PURCHASE_CHAPTER, purchaseChapter);
  yield takeLatest(ActionTypes.GET_LIST_COMMENT_BOOK, getListComment);
  yield takeLatest(ActionTypes.CREATE_COMMENT_BOOK, createComment);
}

export default booksSaga;
