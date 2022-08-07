import { SALE_KIT } from '../actionsType';

const initialState = {
  subCategorySaleKit: [],
  highlightSaleKit: {},
  saleKitList: {},
  saleKitCount: {},
  saleKitLoading: {},
  saleKitPage: {},
  saleKit: null
};

const saleKit = (state = initialState, action) => {
  switch (action.type) {
    case SALE_KIT.GET_SUB_CATEGORY.SUCCESS: {
      return {
        ...state,
        subCategorySaleKit: [...action.payload.items]
      };
    }

    case SALE_KIT.GET_HIGHLIGHT_SALE_KIT.SUCCESS: {
      state.highlightSaleKit[action.payload.cmsCategoryId + ''] = action.payload.items;

      return {
        ...state,
        highlightSaleKit: { ...state.highlightSaleKit }
      };
    }

    case SALE_KIT.GET_SALE_KIT_LIST.SUCCESS: {
      const cmsCategoryId = action.payload.cmsCategoryId || '';

      const list = action.payload.items || [];
      if ([...list].length === 0) {
        return {
          ...state,
          saleKitLoading: {
            ...state.saleKitLoading,
            [cmsCategoryId + '']: null
          }
        };
      }

      if (state.saleKitList[cmsCategoryId + '']) {
        const newData = [...state.saleKitList[cmsCategoryId + ''], ...list];
        return {
          ...state,
          saleKitLoading: {
            ...state.saleKitLoading,
            [cmsCategoryId + '']: false
          },
          saleKitList: {
            ...state.saleKitList,
            [cmsCategoryId + '']: newData
          },
          saleKitPage: {
            ...state.saleKitPage,
            [cmsCategoryId + '']: state.saleKitPage[cmsCategoryId + ''] + 1
          }
        };
      }

      return {
        ...state,
        saleKitLoading: {
          ...state.saleKitLoading,
          [cmsCategoryId + '']: false
        },
        saleKitList: {
          ...state.saleKitList,
          [cmsCategoryId + '']: [...list]
        },
        saleKitPage: {
          ...state.saleKitPage,
          [cmsCategoryId + '']: 1
        }
      };
    }

    case SALE_KIT.GET_SALE_KIT_LIST.CLEAR: {
      return {
        ...state,
        saleKitList: {},
        saleKitPage: {},
        saleKitLoading: {}
      };
    }

    case SALE_KIT.GET_SALE_KIT_DETAIL.SUCCESS: {
      return {
        ...state,
        saleKit: action.payload.item
      };
    }

    default:
      return state;
  }
};

export default saleKit;
