import { CONTACT } from '../actionsType';

export const getContactsHandle = payload => ({
  type: CONTACT.GET_CONTACTS.HANDLER,
  payload
});

export const getContactsSuccess = payload => ({
  type: CONTACT.GET_CONTACTS.SUCCESS,
  payload
});

export const getContactsFailure = payload => ({
  type: CONTACT.GET_CONTACTS.FAILURE,
  payload
});

export const getContactsClear = payload => ({
  type: CONTACT.GET_CONTACTS.CLEAR,
  payload
});

export const getContactDetailHandle = payload => ({
  type: CONTACT.GET_CONTACT_DETAIL.HANDLER,
  payload
});

export const getContactDetailSuccess = payload => ({
  type: CONTACT.GET_CONTACT_DETAIL.SUCCESS,
  payload
});

export const getContactDetailFailure = payload => ({
  type: CONTACT.GET_CONTACT_DETAIL.FAILURE,
  payload
});
