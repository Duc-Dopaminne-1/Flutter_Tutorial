import { ICClose } from '../../../assets/icons';
import { PrimaryButton, RadioBoxes } from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { closeModal, createModal } from '../../../helpers/createModal';
import { depositMethodParse } from '../../../redux/parses/depositMethod';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';

const RefundRequestModal = ({ confirmFunction, cancelFunction }) => {
  const depositMethod = useSelector(state => state.deposit.depositMethod);

  const [selected, setSelected] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (depositMethod !== '[]') {
      setData(depositMethodParse(JSON.parse(depositMethod)));
    } else {
      setData([]);
    }
  }, [depositMethod]);

  const animation = React.useRef(new Animated.Value(0)).current;

  const onClose = () => {
    closeModal();
  };

  const onCancel = () => {
    closeModal();
    cancelFunction?.();
  };

  const next = () => {
    closeModal();
    confirmFunction?.();
  };

  const onPress = () => {
    if (selected === 'AffiliateAccount') {
      next();
      return;
    }
    onCancel();
  };

  React.useEffect(() => {
    Animated.timing(animation, {
      duration: 300,
      toValue: 1,
      useNativeDriver: true
    }).start();
  }, []);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0]
  });

  return (
    <View style={[styles.modalWrapper]}>
      <Animated.View styles={styles.backDrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [
              {
                translateY
              }
            ]
          }
        ]}>
        <TouchableOpacity style={styles.closeContainer} onPress={onClose}>
          <ICClose />
        </TouchableOpacity>

        <AppText translate bold={true} style={styles.textTitle}>
          account.choose_deposit_amount
        </AppText>
        <View style={styles.contentWrapper}>
          <RadioBoxes
            translate
            checked={selected}
            data={data}
            onChange={setSelected}
            boxStyle={styles.idBoxes}
            containerStyle={styles.idContainerBoxes}
          />
          <PrimaryButton
            onPress={onPress}
            translate
            title={'common.confirm'}
            style={styles.buttonWrapper}
          />
        </View>
      </Animated.View>
    </View>
  );
};

RefundRequestModal.propTypes = {
  // bla: PropTypes.string,
};

RefundRequestModal.defaultProps = {
  // bla: 'test',
};

export const changeModal = () => {
  createModal(<RefundRequestModal />);
};

const createRefundRequest = (
  title = '',
  message = '',
  callBackWhenClose,
  confirmFunction,
  cancelFunction
) => {
  createModal(
    <RefundRequestModal
      title={title}
      message={message}
      confirmFunction={confirmFunction}
      callBackWhenClose={callBackWhenClose}
      cancelFunction={cancelFunction}
    />
  );
};

export default createRefundRequest;

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '90%',
    marginBottom: SPACING.XXLarge,
    alignSelf: 'center',
    marginTop: SPACING.Large
  },
  modalWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
    borderRadius: scale(12),
    backgroundColor: BACKGROUND_COLOR.White
  },
  backDrop: {
    width: '100%',
    height: '72%'
  },
  closeContainer: {
    top: scale(16),
    left: scale(16),
    position: 'absolute'
  },
  selectContainer: {
    top: scale(16),
    right: scale(16),
    position: 'absolute'
  },
  selectText: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    color: CUSTOM_COLOR.PersianGreen
  },
  btnClose: {
    color: CUSTOM_COLOR.GreenBold
  },
  textTitle: {
    marginTop: scale(16),
    fontSize: FONT_SIZE.Heading,
    color: CUSTOM_COLOR.BlueStone,
    lineHeight: LINE_HEIGHT.Heading,
    textAlign: 'center',
    marginHorizontal: scale(24)
  },
  contentWrapper: {
    width: '100%',
    borderTopWidth: 1,
    marginTop: SPACING.XXNormal,
    borderTopColor: CUSTOM_COLOR.GreyDivider
  },
  idContainerBoxes: {
    flexDirection: 'column',
    paddingHorizontal: SPACING.Medium
  },
  idBoxes: {
    width: '100%',
    height: scale(52, false),
    borderBottomWidth: scale(1),
    borderBottomColor: CUSTOM_COLOR.GreyDivider
  }
});
