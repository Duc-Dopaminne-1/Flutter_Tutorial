import isEmpty from 'lodash/isEmpty';
import {useEffect, useState} from 'react';

const extractResponseError = (response, dataFieldArr) => {
  let errorMessage = '';
  for (let i = 0; i < dataFieldArr.length; i++) {
    if (!response[dataFieldArr[i]]) {
      errorMessage = response.errorMessage || response.errorCode || response.errorMessageCode;
      break;
    }
  }
  return errorMessage;
};

const extractResponseData = (response, dataFieldArr) => {
  if (isEmpty(dataFieldArr)) {
    return {};
  } else if (dataFieldArr.length === 1) {
    return response[dataFieldArr[0]];
  }
  return response;
};

const useDataMapper = ({
  inittialState,
  useLazyQuery,
  queryOptions,
  mapper,
  dataFieldNameArr = [],
}) => {
  const [data, setData] = useState(inittialState);
  const [execute, queryResult] = useLazyQuery(queryOptions);
  const [error, setError] = useState('');

  useEffect(() => {
    if (queryResult.data) {
      const errorMessage = extractResponseError(queryResult.data, dataFieldNameArr);
      if (isEmpty(errorMessage)) {
        const extractedResponseData = extractResponseData(queryResult.data, dataFieldNameArr);
        const processedData = mapper(extractedResponseData);
        setData(processedData);
      } else {
        setError(errorMessage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryResult.data]);

  return [execute, data, queryResult, error];
};

export default useDataMapper;
