import isEmpty from 'lodash/isEmpty';

export const extractImageUri = post => {
  if (!isEmpty(post?.step2Data?.images)) {
    return post?.step2Data?.images[0]?.url;
  } else if (!isEmpty(post?.images)) {
    return post.images[0]?.uri;
  }
  return null;
};
