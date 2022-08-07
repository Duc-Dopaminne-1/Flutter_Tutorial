import { createSelector } from 'reselect';

export const partnerItemSelector = createSelector(
  [state => state.partner.list, (_state, _props) => _props],
  (list, partnerId) => {
    const result = list.find(item => item?.id === partnerId);
    return result;
  }
);
