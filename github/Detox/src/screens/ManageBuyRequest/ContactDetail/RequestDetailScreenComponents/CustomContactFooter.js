import React from 'react';
import {StyleSheet, View} from 'react-native';

import {CONTACT_STATUS_ID} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomButton from '../../../../components/Button/CustomButton';

const styles = StyleSheet.create({
  fullWidthButton: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGray: {
    backgroundColor: COLORS.GRAY_ED,
  },
  blackText: {color: COLORS.BLACK_31, ...FONTS.bold, ...FONTS.fontSize14},
  buttonOrange: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: COLORS.GREY_F0,
  },
  whiteText: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.NEUTRAL_WHITE,
  },
});

const CustomContactFooter = ({
  containerStyle,
  state,
  onPressLeftButton,
  onPressRightButton,
  isSending,
}) => {
  const {contactTradingStatusId} = state;
  let isShowRight = false;
  let leftTitle = translate(STRINGS.CANCEL);
  let rightTitle = translate(STRINGS.AGREE);

  switch (contactTradingStatusId) {
    case CONTACT_STATUS_ID.Waiting:
      isShowRight = true;
      leftTitle = translate('common.decline');
      rightTitle = rightTitle = translate(STRINGS.AGREE);
      break;
    case CONTACT_STATUS_ID.Connected:
      isShowRight = true;
      if (isSending) {
        leftTitle = translate('contactTrading.status.negotiate');
        rightTitle = translate('contactTrading.status.deposit');
      }
      break;
    case CONTACT_STATUS_ID.Negotiate:
      if (isSending) {
        leftTitle = translate('contactTrading.status.deposit');
      }
      break;
    default:
      break;
  }

  return (
    <View style={[commonStyles.footerContainer, styles.borderTop, containerStyle]}>
      <CustomButton
        style={[
          commonStyles.buttonNext,
          styles.fullWidthButton,
          isShowRight ? styles.buttonGray : styles.buttonOrange,
        ]}
        titleStyle={isShowRight ? styles.blackText : styles.whiteText}
        title={leftTitle}
        onPress={onPressLeftButton}
      />
      {isShowRight && (
        <>
          <View style={commonStyles.separatorColumn12} />
          <CustomButton
            style={[commonStyles.buttonNext, styles.fullWidthButton, styles.buttonOrange]}
            onPress={onPressRightButton}
            title={rightTitle}
            titleStyle={styles.whiteText}
          />
        </>
      )}
    </View>
  );
};

export default CustomContactFooter;
