import { ICClose } from '../../../../assets/icons';
import { PrimaryButton, RadioBoxes } from '../../../../components/';
import AppText from '../../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import { closeModal, createModal } from '../../../../helpers/createModal';
import { depositMethodParse } from '../../../../redux/parses/depositMethod';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { scale } from '../../../../utils/responsive';

const ConsiderRequestModal = ({
  title,
  message,
  callBackWhenClose,
  paymentAccount,
  affiliateAccount
}) => {
  const depositMethod = useSelector(state => state.insurance.depositMethod);

  const [selected, setSelected] = useState(selected);
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      if (depositMethod !== '[]') {
        setData(depositMethodParse(JSON.parse(depositMethod)));
      } else {
        setData([]);
      }
    } catch (error) {}
  }, [depositMethod]);

  const animation = React.useRef(new Animated.Value(0)).current;

  const onClose = () => {
    closeModal();
  };

  const onCancel = () => {
    closeModal();
    affiliateAccount?.();
  };

  const next = () => {
    closeModal();
    paymentAccount?.();
  };

  const onPress = () => {
    if (selected === 'PaymentAccount') {
      next();
      return;
    }
    onCancel();
  };

  useEffect(() => {
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
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.closeContainer} onPress={onClose}>
            <ICClose />
          </TouchableOpacity>

          <AppText translate bold={true} style={styles.textTitle}>
            {'application_list.select_money_account'}
          </AppText>
        </View>

        <View style={styles.contentWrapper}>
          <RadioBoxes
            translate
            checked={selected}
            data={data}
            onChange={setSelected}
            boxStyle={styles.idBoxes}
            containerStyle={styles.idContainerBoxes}
          />
        </View>
        <PrimaryButton
          onPress={onPress}
          translate
          title={'common.confirm'}
          style={styles.buttonWrapper}
        />
      </Animated.View>
    </View>
  );
};

ConsiderRequestModal.propTypes = {
  // bla: PropTypes.string,
};

ConsiderRequestModal.defaultProps = {
  // bla: 'test',
};

export const changeModal = () => {
  createModal(<ConsiderRequestModal />);
};

const createConsiderRequest = props => {
  const { title, message, callBackWhenClose, paymentAccount, affiliateAccount } = props;
  createModal(
    <ConsiderRequestModal
      title={title}
      message={message}
      paymentAccount={paymentAccount}
      callBackWhenClose={callBackWhenClose}
      affiliateAccount={affiliateAccount}
    />
  );
};

export default createConsiderRequest;

const styles = StyleSheet.create({
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
    borderRadius: scale(12),
    backgroundColor: BACKGROUND_COLOR.White
  },
  backDrop: {
    width: '100%',
    height: '72%'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(16)
  },
  closeContainer: {
    marginLeft: SPACING.Medium,
    marginRight: SPACING.XNormal
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
    fontSize: FONT_SIZE.Heading,
    color: CUSTOM_COLOR.BlueStone,
    lineHeight: LINE_HEIGHT.Heading,
    textAlign: 'center'
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
  },
  buttonWrapper: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: SPACING.XXLarge,
    marginTop: SPACING.XLarge
  }
});
