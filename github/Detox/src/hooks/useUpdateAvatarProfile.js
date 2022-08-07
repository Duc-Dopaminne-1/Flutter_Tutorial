import {useCreateProfilePhotoMutation} from '../api/graphql/generated/graphql';
import {useMutationGraphql} from '../api/graphql/useGraphqlApiLazy';

const useUpdateAvatarProfile = ({onSuccess}) => {
  const {startApi: updateAvatarProfile} = useMutationGraphql({
    showSpinner: false,
    graphqlApiLazy: useCreateProfilePhotoMutation,
  });

  const updateAvatarProfileHandler = async ({id, photo}) => {
    updateAvatarProfile(
      {
        variables: {
          input: {
            userId: id,
            photoUrl: photo?.uri,
          },
        },
      },
      () => {
        setTimeout(() => {
          onSuccess();
        }, 500);
      },
    );
  };

  return {updateAvatarProfileHandler};
};

export default useUpdateAvatarProfile;
