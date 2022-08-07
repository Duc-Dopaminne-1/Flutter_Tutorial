import { takeLatest } from 'redux-saga/effects';
import { GROUP_TOPENER } from '../../actionsType';
import { createMemberRequestSaga } from './createMemberRequestSaga';
import { deleteMemberGroupTopenerSaga } from './deleteMemberGroupTopenerSaga';
import { getGroupByIdSaga } from './getGroupByIdSaga';
import { getGroupByTopenerSaga } from './getGroupByTopenerSaga';
import { getGroupForMemberSaga } from './getGroupForMemberSaga';
import { getListRequestOrMemberJoinSaga } from './getListRequestOrMemberJoinSaga';
import { getListRequestOrMemberLeaveSaga } from './getListRequestOrMemberLeaveSaga';
import { getListRequestOrMemberSaga } from './getListRequestOrMemberSaga';
import { getMemberInfoDetailSaga } from './getMemberInfoDetail';
import { processRequestSaga } from './processRequestSaga';

export default function* eventSagas() {
  yield takeLatest(GROUP_TOPENER.GET_GROUP_BY_TOPENER.HANDLER, getGroupByTopenerSaga);
  yield takeLatest(GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER.HANDLER, getListRequestOrMemberSaga);
  yield takeLatest(GROUP_TOPENER.GET_GROUP_FOR_MEMBER.HANDLER, getGroupForMemberSaga);
  yield takeLatest(
    GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER_JOIN.HANDLER,
    getListRequestOrMemberJoinSaga
  );
  yield takeLatest(
    GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER_LEAVE.HANDLER,
    getListRequestOrMemberLeaveSaga
  );
  yield takeLatest(GROUP_TOPENER.CREATE_MEMBER_REQUEST.HANDLER, createMemberRequestSaga);
  yield takeLatest(GROUP_TOPENER.GET_MEMBER_INFO_DETAIL.HANDLER, getMemberInfoDetailSaga);
  yield takeLatest(GROUP_TOPENER.GET_GROUP_BY_ID.HANDLER, getGroupByIdSaga);
  yield takeLatest(GROUP_TOPENER.PROCESS_REQUEST.HANDLER, processRequestSaga);
  yield takeLatest(GROUP_TOPENER.DELETE_MEMBER_GROUP_TOPENER.HANDLER, deleteMemberGroupTopenerSaga);
}
