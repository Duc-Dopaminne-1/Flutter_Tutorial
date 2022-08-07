import { ICClose } from '../../../assets/icons';
import { PrimaryButton, RadioBoxes } from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { closeModal, createModal } from '../../../helpers/createModal';
import React, { useState, useEffect, useContext } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const data_new = [
  {
    value: 3,
    title: 'lead_status.inprocess'
  }
];
const data_inProgress = [
  {
    value: 4,
    title: 'lead_status.on_hold'
  },
  {
    value: 5,
    title: 'lead_status.not_contact'
  },
  {
    value: 6,
    title: 'lead_status.not_qualified'
  }
];
const data_onHold = [
  {
    value: 3,
    title: 'lead_status.inprocess'
  },
  {
    value: 5,
    title: 'lead_status.not_contact'
  },
  {
    value: 6,
    title: 'lead_status.not_qualified'
  }
];

const RefundRequestModal = ({
  title,
  message,
  callBackWhenClose,
  confirmFunction,
  cancelFunction
}) => {
  const [selected, setSelected] = useState(selected);
  const [data, setData] = useState([]);
  const theme = useContext(themeContext);
  const animation = React.useRef(new Animated.Value(0)).current;

  const onClose = () => {
    closeModal();
  };

  const onCancel = () => {
    closeModal();
    cancelFunction?.();
  };

  const next = value => {
    closeModal();
    confirmFunction?.(value);
  };

  const onPress = () => {
    if (selected) {
      next(selected);
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

  useEffect(() => {
    switch (title) {
      case 'assigned':
        setData(data_new);
        break;
      case 'inprogress':
        setData(data_inProgress);
        break;
      case 'onhold':
        setData(data_onHold);
        break;

      default:
        break;
    }
  }, [title]);

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

        <AppText
          translate
          bold={true}
          style={[styles.textTitle, { color: theme?.app?.primaryColor1 }]}>
          lead_status.select_processing_status
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

RefundRequestModal.propTypes = {
  // bla: PropTypes.string,
};

RefundRequestModal.defaultProps = {
  // bla: 'test',
};

export const changeModal = () => {
  createModal(<RefundRequestModal />);
};

const ChangeState = props => {
  const { title, message, callBackWhenClose, confirmFunction, cancelFunction } = props;
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

export default ChangeState;

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
  },
  buttonWrapper: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: SPACING.XXLarge,
    marginTop: SPACING.XLarge
  }
});
