import {useSendPhoneVerificationTokenForTransactionMutation} from '../../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../../api/graphql/useGraphqlApiLazy';

const useSendOTPCode = () => {
  const {startApi: sentOtp} = useMutationGraphql({
    showSpinner: true,
    graphqlApiLazy: useSendPhoneVerificationTokenForTransactionMutation,
  });

  const sendOTP = (phoneNumber: string, transactionId: string, callBack: () => {}) => {
    sentOtp(
      {
        variables: {
          input: {
            phoneNumber: phoneNumber,
            transactionId: transactionId,
          },
        },
      },
      () => {
        callBack();
      },
    );
  };

  return {sendOTP};
};

export default useSendOTPCode;
