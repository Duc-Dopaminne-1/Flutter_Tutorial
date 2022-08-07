import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, ViewStyle, View, Pressable, TextStyle, Text } from 'react-native';
import { colors, fonts } from '@/vars';
import Modal from 'react-native-modal';
import ModalBottomDialogTopView from '../ModalBottomDialogTopView';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import { LOCATION } from '@/constants/app';
import { deleteFilterLocation, setFilterLocation } from '@/redux/filters/actions';
import IconCheckedSVG from '@/components/SVG/IconCheckedSVG';

interface Props {
  citiSelected?: any;

  isVisible: boolean;
  onBackdropPress?: () => void;
  confirmOnPressedCallback?: () => void;

  topTitle?: string;
  bottomTitle?: string;

  closeButtonOnPressed?: () => void;
}

export default function LocationSelectDialog(props: Props): ReactElement {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => {
    return state;
  });

  const { city: userCity } = user.data;

  const { citiSelected = null, isVisible, onBackdropPress = () => {}, topTitle, confirmOnPressedCallback } = props;

  const [citiSelectedTmp, setCitiSelectedTmp] = useState(null);

  useEffect(() => {
    setCitiSelectedTmp(citiSelected);
  }, [citiSelected]);

  // const saveLocationOnPressed = async () => {
  //   if (citiSelectedTmp) {
  //     dispatch(
  //       setFilterLocation(citiSelectedTmp, {
  //         onSuccess: () => {
  //           onBackdropPress();
  //         },
  //         onFail: () => {
  //           onBackdropPress();
  //         },
  //       }),
  //     );
  //   } else {
  //     dispatch(
  //       deleteFilterLocation({
  //         onSuccess: () => {
  //           onBackdropPress();
  //         },
  //         onFail: () => {
  //           onBackdropPress();
  //         },
  //       }),
  //     );
  //   }
  // };

  const onBack = () => {
    setCitiSelectedTmp(citiSelected);
    onBackdropPress && onBackdropPress();
  };

  const cityOnPressed = () => {
    // setCitiSelectedTmp(userCity);
    dispatch(
      setFilterLocation(userCity, {
        onSuccess: () => {
          // onBackdropPress();
          confirmOnPressedCallback && confirmOnPressedCallback();
        },
        onFail: () => {
          onBackdropPress();
        },
      }),
    );
  };

  const nearCurrentLocation = () => {
    // setCitiSelectedTmp(null);
    dispatch(
      deleteFilterLocation({
        onSuccess: () => {
          // onBackdropPress();
          confirmOnPressedCallback && confirmOnPressedCallback();
        },
        onFail: () => {
          onBackdropPress();
        },
      }),
    );
  };

  const renderCity = () => {
    if (!userCity) return null;
    const icCheckedCompnent = userCity.id === citiSelectedTmp?.id ? <IconCheckedSVG /> : <View />;
    return (
      <Pressable style={styles.rowCheck} onPress={cityOnPressed}>
        <Text style={styles.textStyle}>{userCity.name}</Text>
        {icCheckedCompnent}
      </Pressable>
    );
  };

  const renderNewCurrentLocation = () => {
    const icCheckedCompnent = !citiSelectedTmp ? <IconCheckedSVG /> : <View />;
    return (
      <Pressable style={styles.rowCheck} onPress={nearCurrentLocation}>
        <Text style={styles.textStyle}>{LOCATION.NEAR_CURRENT_LOCATION}</Text>
        {icCheckedCompnent}
      </Pressable>
    );
  };

  return (
    <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={styles.wrapModal}>
      <View style={styles.container}>
        {/* Top View Area */}
        <View style={styles.topViewWrapper}>{<ModalBottomDialogTopView title={topTitle} closeButtonOnPressed={onBack} />}</View>

        {/* LineBreak View */}
        {/* <View style={styles.lineBreakView} /> */}

        {/* Middle View Area */}

        <View style={styles.middleViewWrapper}>
          {renderCity()}
          {renderNewCurrentLocation()}
        </View>

        {/* Bootom View Area */}
        <View style={styles.bottomViewWrapper}>
          {/* <AppButton
            title={bottomTitle}
            onPressed={() => {
              saveLocationOnPressed();
            }}
          /> */}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.transparent,
  } as ViewStyle,

  wrapModal: {
    margin: 0,
    justifyContent: 'flex-end',
  } as ViewStyle,

  // lineBreakView: {
  //   backgroundColor: colors.separator_line,
  //   height: 1,
  // } as ViewStyle,

  topViewWrapper: {
    padding: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

  middleViewWrapper: {
    padding: 10,
    backgroundColor: colors.white,
  } as ViewStyle,

  bottomViewWrapper: {
    height: 50,
    padding: 10,
    backgroundColor: colors.white,
  } as ViewStyle,

  textStyle: {
    flex: 1,
    textAlign: 'left',
    fontSize: fonts.size.s18,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  rowCheck: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  } as ViewStyle,
});
