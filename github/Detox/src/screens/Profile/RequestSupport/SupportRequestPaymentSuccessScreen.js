import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomFooterButtons from '../../../components/Button/CustomFooterButtons';
import ScreenIds from '../../ScreenIds';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.fillCenter,
  },
  iconSuccess: {
    padding: 16,
    height: 100,
    width: 100,
  },
  successTitle: {
    ...FONTS.fontSize20,
    ...FONTS.bold,
    color: COLORS.BLACK_31,
  },
});

const SupportRequestPaymentSuccessScreen = ({navigation, route}) => {
  const {transactionId, propertyPostId} = route.params;

  const onPressGoToHome = () => {
    navigation.navigate(ScreenIds.Home);
  };

  const onPressViewDetail = () => {
    navigation.navigate(ScreenIds.DetailRequestSupport, {
      ticketId: transactionId,
      propertyPostId,
      isRequest: true,
    });
  };

  return (
    <BaseScreen showHeader={false}>
      <View style={styles.container}>
        <Image source={IMAGES.IC_SUCCESS_FILL} style={styles.iconSuccess} resizeMode="contain" />
        <View style={commonStyles.separatorRow12} />
        <Text style={styles.successTitle}>{translate('payment.success')}</Text>
        <View style={commonStyles.separatorRow16} />
        <Text style={{...commonStyles.blackText14, ...HELPERS.textCenter}}>
          {translate('payment.successPayTopenerService')}
        </Text>
      </View>
      <View style={[commonStyles.footerContainer, commonStyles.borderTop]}>
        <CustomFooterButtons
          cancelButtonStyle={styles.declineButton}
          cancelTextStyle={commonStyles.blackText14}
          nextButtonStyle={[HELPERS.fill, commonStyles.primaryBackgroundColor]}
          nextTextStyle={commonStyles.whiteText14}
          cancelButtonTitle={translate(STRINGS.HOME)}
          nextButtonTitle={translate(STRINGS.VIEW_DETAIL)}
          onPressCancel={onPressGoToHome}
          onPressNext={onPressViewDetail}
        />
      </View>
    </BaseScreen>
  );
};

export default SupportRequestPaymentSuccessScreen;
