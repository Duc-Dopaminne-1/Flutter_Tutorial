import React from 'react';
import {StyleSheet, View} from 'react-native';

import LinkTextButton from '../../../components/LinkTextButton';
import RoundButtonNext from '../../../components/RoundButtonNext';

const styles = StyleSheet.create({
  footerView: {
    marginTop: 70,
    marginBottom: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  linkTextButton: {
    marginTop: 10,
  },
});

const FooterViewSignUp = ({style, onPressButton, onPressText, title}) => {
  return (
    <View style={[styles.footerView, style]}>
      <RoundButtonNext onPress={onPressButton} />
      {!!title && (
        <LinkTextButton style={styles.linkTextButton} onPress={onPressText} title={title} />
      )}
    </View>
  );
};

export default FooterViewSignUp;
