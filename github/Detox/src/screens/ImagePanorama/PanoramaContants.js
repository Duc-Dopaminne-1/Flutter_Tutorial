import {Platform} from 'react-native';

export const ContainerSideRequests = {
  REQUEST_FORM_FRAME_SEND_SHARE_DATA: 'panorama_container_request_form_frame_send_share_data',
  REQUEST_FORM_FRAME_RECEIVE_SHARE_DATA: 'panorama_container_request_form_frame_receive_share_data',
  REQUEST_REVIEW_FRAME_RECEIVE_REVIEW_DATA:
    'panorama_container_request_review_frame_receive_review_data',
};

export const ReviewSideRequests = {
  REQUEST_CONTAINER_SEND_REVIEW_DATA: 'panorama_review_frame_request_container_send_review_data',
  REQUEST_CONTAINER_CLOSE_REVIEW: 'panorama_review_frame_request_container_close_review',
  REQUEST_CONTAINER_GO_TO_UPDATE_PAGE: 'panorama_review_frame_request_container_go_to_update_page',
};

export const FormSideRequests = {
  REQUEST_CONTAINER_SEND_SHARE_DATA: 'panorama_form_frame_request_container_send_share_data',
  REQUEST_CONTAINER_RECEIVE_SHARE_DATA: 'panorama_form_frame_request_container_receive_share_data',
  REQUEST_CONTAINER_SELECT_IMAGES: 'panorama_form_frame_request_container_select_images',
  REQUEST_CONTAINER_DELETE_IMAGE: 'panorama_form_frame_request_container_delete_image',
  REQUEST_CONTAINER_GO_TO_MY_POST_LIST: 'panorama_form_frame_request_container_go_to_my_post_list',
  REQUEST_CONTAINER_GO_TO_MY_POST_DETAIL:
    'panorama_form_frame_request_container_go_to_my_post_detail',
  REQUEST_CONTAINER_SHOW_REVIEW_MODAL: 'panorama_form_frame_request_container_show_review_modal',
  REQUEST_CONTAINER_SAVE_PANORAMA: 'panorama_form_frame_request_container_save_panorama',
  REQUEST_CONTAINER_GO_TO_CONGRATS_PAGE:
    'panorama_form_frame_request_container_go_to_congrats_page',
  REQUEST_CONTAINER_DONT_SHOW_TUTORIAL_HINT_AGAIN:
    'panorama_form_frame_request_container_dont_show_tutorial_hint_again',
};

export const PanoramaFormTypes = {
  CREATE: 'create',
  UPDATE: 'update',
};

export const PanoramaPlaces = {
  MY_POST_DETAIL: 'detail',
};

export const MaxFileUpload = 5;

export const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;

export const USER_AGENT_360 = Platform.OS === 'android' ? '__AndroidWebView__' : '__IOSWebView__';

export const PanoramaApprovalStatuses = {
  WAITING: 'waiting',
  REQUEST_UPDATE: 'request_update',
  APPROVED: 'approved',
};

export const ORIENTATION_STATE = {
  LANDSCAPE: 'LANDSCAPE',
  PORTRAIT: 'PORTRAIT',
  LEFT: 'LANDSCAPE-LEFT',
  RIGHT: 'LANDSCAPE-RIGHT',
};
