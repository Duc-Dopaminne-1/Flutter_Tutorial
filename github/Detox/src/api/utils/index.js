import {parseGraphqlError} from '../graphql/parseGraphqlError';

export const handleGetResponse = (response, loading, error, context, onSuccess) => {
  const {showErrorAlert} = context;
  if (loading) {
    return;
  }
  if (error) {
    const errorMessage = parseGraphqlError(error);
    showErrorAlert(errorMessage);
    return;
  }
  if (response) {
    onSuccess(response);
  }
};
