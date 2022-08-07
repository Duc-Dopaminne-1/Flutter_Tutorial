import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View, Pressable } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/reducers';
import DefaultText from '@/components/CustomText/DefaultText';

interface Props {
  submitOnPressed?: () => void;
}

export default function ReviewSubmitView(props: Props): ReactElement {
  // const { user } = useSelector((state: RootState) => {
  //   return state;
  // });
  const { submitOnPressed = () => {} } = props;
  // const { auction } = reviewObject;

  return (
    <View style={styles.submitView}>
      <Pressable style={styles.pauseMyAccountButtonView} onPress={submitOnPressed}>
        <DefaultText {...{ style: styles.submitText }}>{language('moveAndScaleScreen.submit')}</DefaultText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  submitView: {
    padding: 2,
    marginVertical: 20,
    alignItems: 'center',
  } as ViewStyle,

  pauseMyAccountButtonView: {
    width: '85%',
    height: 50,
    borderRadius: 36,
    backgroundColor: colors.red_700,
    justifyContent: 'center',
  } as ViewStyle,

  submitText: {
    textAlign: 'center',
    fontSize: fonts.size.s17,
    color: colors.white,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,
});
