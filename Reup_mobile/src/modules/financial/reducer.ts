import { FinancialCardType } from '@reup/reup-api-sdk/libs/api/enum';
import { IFinancialResponse } from '@reup/reup-api-sdk/libs/api/financial/models';
import { CommonActionType } from '../auth';
import { ActionTypes, IActionFinancial } from './index';

export interface IFinancialState {
  bankAccount: IFinancialResponse;
}

const initialState: IFinancialState = {
  bankAccount: {
    id: 0,
    city: {
      id: 0,
      name: '',
      code: '',
    },
    country: {
      id: 0,
      name: '',
      code: '',
      currency: '',
      emoji: '',
    },
    name_on_card: '',
    card_number: '',
    brand: '',
    expire_day: '',
    card_type: FinancialCardType.Credit,
    user: '',
    property: '',
    company_id: '',
    bank_name: '',
  },
};

const reducer = (state: IFinancialState = initialState, action: IActionFinancial) => {
  switch (action.type) {
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    case ActionTypes.SAVE_BANK_ACCOUNT:
      return {
        bankAccount: action.payload.result,
      };
    default:
      return state;
  }
};

export default reducer;
