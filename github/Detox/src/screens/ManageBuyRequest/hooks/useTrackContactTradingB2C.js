import {useTrackContactTradingB2CMutation} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';

const useTrackContactTradingB2C = ({onSuccessResponse = () => {}}) => {
  const {startApi: showTractContactTradingB2C} = useMutationGraphql({
    graphqlApiLazy: useTrackContactTradingB2CMutation,
    showSpinner: true,
  });
  const startTractContactTradingB2C = ({contactTradingB2CId, viewType = 'email'}) => {
    showTractContactTradingB2C(
      {
        variables: {
          input: {contactTradingB2CId, viewType: viewType},
        },
      },
      () => onSuccessResponse(viewType),
    );
  };

  return {startTractContactTradingB2C};
};

export default useTrackContactTradingB2C;
