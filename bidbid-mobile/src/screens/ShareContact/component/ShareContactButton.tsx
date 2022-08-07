import React, { ReactElement, memo, useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import { colors, fonts, screenWidth } from '@/vars';
import { isIphoneX } from '@/shared/devices';
import { UpdateTotalSelectContact } from '@/shared/global';
import { shareContacts } from '@/shared/shareContacts';
interface ShareContactButtonProps {
  onPress?: () => void;
}
function ShareContactButton(props: ShareContactButtonProps): ReactElement {
  const [shouldEnable, setShouldEnable] = useState(false);
  const statusButton = useRef(false);

  useEffect(() => {
    const UpdateTotalSelectContactSubscribe = UpdateTotalSelectContact.subscribe(_data => {
      const totalSelect = shareContacts.getTotalSelect();

      if (totalSelect > 0) {
        if (!statusButton.current) {
          statusButton.current = true;
          setShouldEnable(true);
        }
        return;
      }
      if (statusButton.current) {
        statusButton.current = false;
        setShouldEnable(false);
      }
    });

    return () => {
      UpdateTotalSelectContactSubscribe && UpdateTotalSelectContactSubscribe.unsubscribe();
    };
  }, []);

  const { onPress } = props;

  const onPressBtn = () => (!statusButton.current ? {} : onPress());

  return (
    <View style={styles.container}>
      <CustomButton
        onPress={onPressBtn}
        containerStyle={[styles.wrapChat, !shouldEnable && styles.wrapBtn]}
        textStyle={styles.textChat}
        text={language('inviteFriends')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: isIphoneX() ? 15 : 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: isIphoneX() ? 30 : 12,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    shadowColor: colors.gray_shadow_beta,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 30,
  },
  textChat: {
    fontSize: fonts.size.s16,
    color: colors.white,
    fontFamily: fonts.family.PoppinsRegular,
  },
  wrapChat: {
    width: screenWidth - 24,
    paddingVertical: 11,
    backgroundColor: colors.red_700,
  },
  wrapBtn: {
    backgroundColor: colors.white_alpha,
  },
});

export default memo(ShareContactButton);
