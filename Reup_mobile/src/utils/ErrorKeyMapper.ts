/*
HOW TO USE
* map('404');
-> return error message key or undefined.

* translateErrorMessage('404', 'Fallback message');
- 404: error code you want to translate.
- Fallback message: message fallback if error code not found in constants code.
-> return message translated of fallback message
*/

import translate from '@src/localize';
import { ErrorKeyCode } from '@src/constants/ErrorKeyCode';

export function map(code: number) {
  return `error.${ErrorKeyCode[code]}`;
}

export function translateErrorMessage(code?: number, message?: string) {
  if (code && ErrorKeyCode[code]) {
    return translate(`error.${ErrorKeyCode[code]}`);
  } else {
    return `${message}`;
  }
}
