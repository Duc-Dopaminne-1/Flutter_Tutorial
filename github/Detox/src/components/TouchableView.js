import PropTypes from 'prop-types';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';

const TouchableView = ({children, onPress}) => {
  return (
    <TouchableOpacity disabled={onPress ? false : true} onPress={onPress}>
      <View>{children}</View>
    </TouchableOpacity>
  );
};

TouchableView.propTypes = {
  onPress: PropTypes.func,
};

export default TouchableView;
