import { NEWS } from '../actionsType';

const initialState = {
  highlightNews: [],
  newsList: null,
  newsListLoading: null,
  newsListPage: 0,
  newsCount: 0,
  news: null
};

const news = (state = initialState, action) => {
  switch (action.type) {
    case NEWS.GET_HIGHLIGHT_NEWS.SUCCESS: {
      return {
        ...state,
        highlightNews: [...action.payload.items]
      };
    }

    case NEWS.GET_NEWS_LIST.HANDLER: {
      return {
        ...state,
        newsListLoading: true
      };
    }

    case NEWS.GET_NEWS_LIST.SUCCESS: {
      const list = action.payload.items || [];

      if ([...list].length === 0) {
        return {
          ...state,
          newsListLoading: null
        };
      }

      if (state.newsList) {
        const newData = [...state.newsList, ...list];
        return {
          ...state,
          newsListLoading: false,
          newsList: newData,
          newsListPage: state.newsListPage + 1
        };
      }

      return {
        ...state,
        newsListLoading: false,
        newsList: [...list],
        newsListPage: state.newsListPage + 1
      };
    }
    case NEWS.GET_NEWS_LIST.CLEAR: {
      return {
        ...state,
        newsList: null,
        newsListPage: 0
      };
    }

    case NEWS.GET_NEWS_DETAIL.SUCCESS: {
      return {
        ...state,
        news: action.payload.item
      };
    }

    default:
      return state;
  }
};

export default news;
