import React from 'react';

import IconHeartButton from './IconHeartButton';

const InterestedButton = ({
  disabled = false,
  isInterested,
  customStyle = {},
  onPress = () => {},
}) => {
  return (
    <IconHeartButton
      disabled={disabled}
      customStyle={customStyle}
      isFollowed={isInterested}
      onPress={onPress}
    />
  );
};

export default InterestedButton;
