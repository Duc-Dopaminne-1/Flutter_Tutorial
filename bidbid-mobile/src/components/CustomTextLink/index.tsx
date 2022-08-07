import React, { ReactElement } from 'react';
import { Linking, StyleSheet, Text, TextStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import NavigationActionsService from '@/navigation/navigation';
import { PAYMENT_ACCOUNTS_SCREEN } from '@/navigation/screenKeys';
import { DeepLinkNotification } from '@/models';

interface CancelMeetConfirmModalProps {
  textFirst?: string;
  textLink?: string;
  textLast?: string;
  type?: string;
  email?: string;
}

function CustomTextLink(props: CancelMeetConfirmModalProps): ReactElement {
  const { textFirst, textLink, textLast, type, email = '' } = props;

  const onPressLink = async () => {
    if (type === DeepLinkNotification.PAYMENT_FAILED_REMIND_30 || type === DeepLinkNotification.PAYMENT_FAILED_END_BID_NOW) {
      NavigationActionsService.push(PAYMENT_ACCOUNTS_SCREEN);
    }
    if (type === DeepLinkNotification.PAYMENT_ISSUE || type === DeepLinkNotification.REVIEW_LOW) {
      const url = `mailto:${email}?subject=&body=`;
      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      }
    }
  };

  return (
    <>
      <Text style={styles.description}>
        {textFirst}
        <Text onPress={onPressLink} style={styles.descriptionLink}>
          {textLink}
        </Text>
        {textLast}
      </Text>
    </>
  );
}

export default React.memo(CustomTextLink);

const styles = StyleSheet.create({
  description: {
    flex: 1,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.gray_700,
  } as TextStyle,

  descriptionLink: {
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: fonts.size.s14,
    fontWeight: '500',
    color: colors.blue_700,
    fontFamily: fonts.family.PoppinsMedium,
    textDecorationLine: 'underline',
  } as TextStyle,
});
