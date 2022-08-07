import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {CONSTANTS, DATA_MODAL_WELLCOME} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {METRICS, normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import ListItemWelcome from '../../screens/Auth/AuthComponents/ListItemWelcome';
import ScreenIds from '../../screens/ScreenIds';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import CustomButton from '../Button/CustomButton';
import CustomIconButton from '../CustomIconButton';
import ModalPopup from '../Modal/ModalPopup';

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  container: {
    width: SCREEN_SIZE.WIDTH - 32,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: 24,
    paddingTop: 32,
    borderRadius: 5,
  },
  titleModal: {...FONTS.bold, color: COLORS.STATE_ERROR, fontSize: 18, textAlign: 'center'},
  subTitleModal: {fontSize: 14, textAlign: 'center', maxWidth: 200},
  flatlist: {
    marginTop: 20,
  },
  line: {width: 80, height: 1, backgroundColor: COLORS.GREY_E4, marginVertical: 20},
  btnUpdate: {...FONTS.bold, color: COLORS.NEUTRAL_WHITE, marginHorizontal: 50},
  viewItem: {alignItems: 'flex-start', width: '100%'},
});

export const RegisterAgentModal = ({isShowModal, setShowModal}) => {
  const navigation = useNavigation();

  const onDismissPopupError = () => {
    setShowModal(false);
  };

  const renderItem = item => {
    return (
      <ListItemWelcome key={item.title} customerStyle={METRICS.resetPadding} title={item.title} />
    );
  };

  const onPressUpdate = () => {
    onDismissPopupError();
    navigation.navigate(ScreenIds.RegisterAgent);
  };

  return (
    <ModalPopup
      visible={isShowModal}
      contentContainerStyle={styles.successPopupStyle}
      animationType="slide">
      <View style={styles.container}>
        <Image source={IMAGES.IC_LIGHT} style={METRICS.normalMarginBottom} />
        <Text style={styles.titleModal}>{'Dự án chỉ dành cho Topener'}</Text>
        <View style={styles.line} />
        <Text style={styles.subTitleModal}>{'Để đặt chỗ vui lòng nâng cấp thành Topener'}</Text>
        <CustomButton
          title={'Nâng cấp ngay'}
          titleColor={COLORS.GREY_82}
          titleStyle={styles.btnUpdate}
          style={[commonStyles.buttonNext, {marginVertical: normal}]}
          onPress={onPressUpdate}
        />
        <View style={styles.viewItem}>
          <Text style={{color: COLORS.GRAY_97, ...FONTS.regular}}>Lợi ích khi là Topener:</Text>
          <View style={styles.flatlist}>{DATA_MODAL_WELLCOME.map(item => renderItem(item))}</View>
        </View>
        <CustomIconButton
          style={styles.closeButton}
          onPress={onDismissPopupError}
          image={IMAGES.IC_DISMISS}
          imageStyle={commonStyles.buttonDismiss}
          hitSlop={CONSTANTS.HIT_SLOP}
        />
      </View>
    </ModalPopup>
  );
};

RegisterAgentModal.propTypes = {
  isShowModal: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onPressUpdate: PropTypes.func,
};

RegisterAgentModal.defaultProps = {
  isShowModal: true,
  onPressUpdate: () => {},
};
