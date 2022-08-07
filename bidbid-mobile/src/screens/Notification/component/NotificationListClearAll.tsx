import * as React from 'react';
import { Text, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { ReactElement, useState } from 'react';
import { colors, fonts } from '@/vars';
import Modal from 'react-native-modal';
import IconCloseSVG from '@/components/SVG/IconCloseSVG';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import NavigationActionsService from '@/navigation/navigation';
import { deleteAllNotification } from '@/redux/notification/actions';
import { alertError } from '@/shared/alert';

function NotificationListClearAll(): ReactElement {
  const [shouldShowModal, setShouldShowModal] = useState(false);

  const setShowModal = () => {
    setShouldShowModal(true);
  };

  const onPressOk = () => {
    onBackdropPress();
    NavigationActionsService.showLoading();
    NavigationActionsService.dispatchAction(
      deleteAllNotification({
        onSuccess: () => {
          NavigationActionsService.hideLoading();
        },
        onFail: (error: string) => {
          NavigationActionsService.hideLoading();
          alertError(error);
        },
      }),
    );
  };

  const onBackdropPress = () => {
    setShouldShowModal(false);
  };

  return (
    <View>
      <Pressable onPress={setShowModal} style={styles.container}>
        <Text style={styles.text}>{language('clearAll')}</Text>
      </Pressable>

      <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={shouldShowModal}>
        <View style={styles.modal}>
          <Pressable style={styles.close} onPress={onBackdropPress}>
            <IconCloseSVG />
          </Pressable>

          <Text style={styles.textTitle}>{language('clearAllNotification')}</Text>

          <CustomButton containerStyle={styles.btnOk} onPress={onPressOk} textStyle={styles.textOk} text={language('ok')} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  text: {
    fontFamily: fonts.family.RobotoRegular,
    textDecorationLine: 'underline',
    color: colors.red_700,
    fontSize: fonts.size.s14,
  },
  modal: {
    backgroundColor: colors.white,
    paddingTop: 15,
    paddingBottom: 40,
    paddingHorizontal: 15,
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
    textAlign: 'center',
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

export default React.memo(NotificationListClearAll);
