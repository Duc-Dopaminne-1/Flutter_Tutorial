import React from 'react';
import { ICSuccess } from '../../../assets/icons';
import { SPACING } from '../../../constants/size';
import { scale } from '../../../utils/responsive';
import AppText from '../../../components/app_text';
import { PrimaryButton } from '../../../components/';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import SCREENS_NAME from '../../../constants/screens';

const RefundRequestSuccess = () => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      hideLeftHeader: true
    });
  }, []);

  const gotoList = () => {
    navigation.navigate(SCREENS_NAME.MIDDLEWARE);
  };

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.flex}>
        <View style={styles.header}>
          <ICSuccess />
        </View>
        <AppText translate bold={true} style={styles.message}>
          {'credit.success_msg'}
        </AppText>
      </View>
      <View style={styles.footer}>
        <PrimaryButton translate title={'common.back_to_main_screen'} onPress={gotoList} />
      </View>
    </SafeAreaView>
  );
};

export default RefundRequestSuccess;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  header: {
    marginTop: SPACING.Medium * 2,
    marginBottom: SPACING.Medium,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,

    textAlign: 'center',
    marginBottom: scale(16)
  },
  footer: {
    marginHorizontal: SPACING.Medium
  }
});
