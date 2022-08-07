import React, { ReactElement } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import DefaultText from '@/components/CustomText/DefaultText';
import NavigationActionsService from '@/navigation/navigation';
import { TERM_OF_SERVICE_SCREEN, PRIVACY_POLICY_SCREEN } from '@/navigation/screenKeys';
import { language } from '@/i18n';
type Props = {
  containerStyle?: StyleProp<ViewStyle>;
};

export function WelcomePolicy(props: Props): ReactElement {
  return (
    <View style={Object.assign({}, styles.container, props.containerStyle)}>
      <DefaultText {...{ style: styles.policy }}>
        {language('welcomeTermPrefix')}
        <DefaultText
          {...{
            style: styles.underLine,
            onPress: () => {
              NavigationActionsService.push(TERM_OF_SERVICE_SCREEN);
            },
          }}
        >
          {language('termOfService')}
        </DefaultText>
        {` ${language('welcomeTermAnd')} `}
        <DefaultText
          {...{
            style: styles.underLine,
            onPress: () => {
              NavigationActionsService.push(PRIVACY_POLICY_SCREEN);
            },
          }}
        >
          {language('privacyPolicy')}
          {''}
        </DefaultText>
      </DefaultText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  policy: {
    color: colors.gray_700,
    fontSize: fonts.size.s14,
    textAlign: 'center',
  },
  underLine: {
    textDecorationLine: 'underline',
    color: colors.red_700,
    fontSize: fonts.size.s14,
  },
});
