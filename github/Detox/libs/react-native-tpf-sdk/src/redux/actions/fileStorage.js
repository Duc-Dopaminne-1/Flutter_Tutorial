import { FILE_STORAGE } from '../actionsType';

export const uploadFileStorage = payload => ({
  type: FILE_STORAGE.UPLOAD.HANDLER,
  payload
});

export const scanIdCardHandle = payload => ({
  type: FILE_STORAGE.SCAN_ID_CARD.HANDLER,
  payload
});
