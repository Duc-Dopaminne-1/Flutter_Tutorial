import React, { ReactElement, useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { language } from '@/i18n';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import Modal from 'react-native-modal';
import CustomButton from '@/components/CustomButton';
import NavigationActionsService from '@/navigation/navigation';
import { readAll } from '@/redux/notification/actions';
import { alertError } from '@/shared/alert';
import { NotificationContext } from '@/screens/Notification/NotificationContext';
import ReadAllSVG from '@/components/SVG/ReadAllSVG';
import CheckNotiSVG from '@/components/SVG/CheckNotiSVG';
import IconCloseSVG from '@/components/SVG/IconCloseSVG';

export function NotificationHeader(): ReactElement {
  const [showPicker, setShowPicker] = useState(false);
  const { isEmpty } = useContext(NotificationContext);

  const setShowDate = () => {
    setShowPicker(true);
  };

  const onBackdropPress = () => {
    setShowPicker(false);
  };

  const onPressSubIcon = () => {
    if (isEmpty) return;
    setShowDate();
  };

  const onPressReadAll = () => {
    NavigationActionsService.showLoading();
    NavigationActionsService.dispatchAction(
      readAll({
        onSuccess: () => {
          NavigationActionsService.hideLoading();
          onBackdropPress();
        },
        onFail: (err: string) => {
          NavigationActionsService.hideLoading();
          onBackdropPress();
          setTimeout(() => {
            alertError(err);
          }, 500);
        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        isShadow={false}
        containerStyle={styles.wrapHeader}
        titleStyle={styles.textHeader}
        title={language('notifications')}
        rightIcon={isEmpty ? <ReadAllSVG /> : <CheckNotiSVG />}
        onPressSubIcon={onPressSubIcon}
      />
      <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={showPicker}>
        <View style={styles.modal}>
          <Pressable style={styles.close} onPress={onBackdropPress}>
            <IconCloseSVG />
          </Pressable>

          <Text style={styles.textTitle}>{language('markRead')}</Text>
          <Text style={styles.textNote}>{language('wantViewed')}</Text>

          <CustomButton containerStyle={styles.btnOk} onPress={onPressReadAll} textStyle={styles.textOk} text={language('ok')} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  wrapHeader: {
    marginTop: 0,
    paddingHorizontal: 24,
  },
  textHeader: {
    fontSize: fonts.size.s22,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  },
  modal: {
    backgroundColor: colors.white,
    paddingTop: 15,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  close: {
    alignSelf: 'flex-end',
    marginRight: 15,
  },
  textTitle: {
    marginTop: 16,
    fontFamily: fonts.family.PoppinsBold,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
  },
  textNote: {
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 60,
    color: colors.gray_500,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s14,
  },
  btnOk: {
    alignSelf: 'center',
    backgroundColor: colors.red_700,
    paddingVertical: 13,
    marginTop: 16,
    borderRadius: 36,
  },
  textOk: {
    fontFamily: fonts.family.PoppinsBold,
    fontSize: fonts.size.s16,
    color: colors.white,
  },
});
