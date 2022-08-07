import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal, small} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import {HTMLText} from '../../screens/ProjectDetail/components/HTMLText';
import CustomButton from '../Button/CustomButton';

const styles = StyleSheet.create({
  container: {
    paddingTop: 44,
  },
  title: {
    ...FONTS.bold,
    fontSize: 21,
    color: COLORS.TEXT_DARK_10,
    marginHorizontal: normal,
    marginBottom: small,
  },
  body: {
    paddingHorizontal: normal,
  },
});

export const PolicyModal = ({modalizeRef, title, html, onPress, withReactModal = false}) => {
  return (
    <Modalize
      threshold={300}
      velocity={1000}
      handlePosition="inside"
      modalTopOffset={20}
      modalStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
      adjustToContentHeight={true}
      withReactModal={withReactModal}
      ref={modalizeRef}>
      <View style={styles.container}>
        {!!title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.body}>{!!html && <HTMLText text={html} />}</View>
        <View style={commonStyles.footerContainer}>
          <CustomButton
            style={commonStyles.buttonConfirm}
            title={translate('common.agree')}
            onPress={onPress}
          />
        </View>
      </View>
    </Modalize>
  );
};
