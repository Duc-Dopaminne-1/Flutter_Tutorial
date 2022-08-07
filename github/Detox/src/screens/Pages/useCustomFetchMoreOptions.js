import isEmpty from 'lodash/isEmpty';

const useCustomFetchMoreOptions = ({queryParams, responseDataKey, dataListField}) => {
  return ({currentPage, updatePage}) => {
    const variables = {
      input: {
        ...queryParams,
        page: currentPage + 1,
      },
    };
    const updateQuery = (prev, {fetchMoreResult}) => {
      if (!prev || !fetchMoreResult) {
        return prev;
      }
      const items = fetchMoreResult[responseDataKey][dataListField];
      if (!isEmpty(items)) {
        updatePage(currentPage + 1);
      }
      return {
        [responseDataKey]: {
          totalCount: fetchMoreResult[responseDataKey].totalCount,
          currentPage: currentPage + 1,
          [dataListField]: [...prev[responseDataKey][dataListField], ...items],
        },
      };
    };
    return {variables, updateQuery};
  };
};

export default useCustomFetchMoreOptions;
