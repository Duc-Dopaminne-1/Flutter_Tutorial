import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';

import {CONSTANTS} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {small} from '../../../assets/theme/metric';
import CustomIconButton from '../../../components/CustomIconButton';
import {testProps} from '../../../utils/testProps';
import {ids} from '../../ids';

const AuthBackButton = (style, canGoBack) => {
  const navigation = useNavigation();

  const onPressBack = () => {
    canGoBack && navigation.goBack();
  };

  return (
    <CustomIconButton
      {...testProps(ids.common.backButton)}
      style={styles.container}
      onPress={onPressBack}
      image={IMAGES.ARROW_LEFT_LINEAR}
      hitSlop={CONSTANTS.HIT_SLOP}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingEnd: 12,
    paddingVertical: small,
  },
});

export default AuthBackButton;
