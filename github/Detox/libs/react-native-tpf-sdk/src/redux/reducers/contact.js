import { CONTACT } from '../actionsType';

const initialState = {
  list: null,
  detail: {},
  loading: null,
  totalCount: 0
};

const contact = (state = initialState, action) => {
  switch (action.type) {
    case CONTACT.GET_CONTACTS.HANDLER: {
      return {
        ...state,
        loading: true
      };
    }

    case CONTACT.GET_CONTACTS.SUCCESS: {
      const { items, totalCount, loadMore } = action.payload;
      const newData = loadMore ? [...state.list, ...items] : items;

      return {
        ...state,
        loading: false,
        list: newData,
        totalCount
      };
    }

    case CONTACT.GET_CONTACTS.FAILURE: {
      return {
        ...state,
        loading: false
      };
    }

    case CONTACT.GET_CONTACTS.CLEAR: {
      return {
        ...state,
        list: null,
        totalCount: 0
      };
    }

    case CONTACT.GET_CONTACT_DETAIL.SUCCESS: {
      return {
        ...state,
        detail: action.payload.detail
      };
    }

    default:
      return state;
  }
};

export default contact;
