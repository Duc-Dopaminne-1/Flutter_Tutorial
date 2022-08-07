import { createSelector } from 'reselect';

export const leadListSelector = state => state.lead.list;
export const leadPageSelector = state => state.lead.page;
export const leadLoadingSelector = state => state.lead.loading;
export const leadItemSelector = createSelector(
  [leadListSelector, (_state, props) => props],
  (list = [], leadId) => {
    const result = list.find(item => item.id === leadId);
    return result;
  }
);
