import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import { colors } from '@/vars';
import Modal from 'react-native-modal';
import ModalBottomDialogTopView from '../ModalBottomDialogTopView';
import { setFilterDistance } from '@/redux/filters/actions';
import { useDispatch } from 'react-redux';
import ShowDistanceItem from './ShowDistanceItem';

interface Props {
  distanceSelected?: any;

  isVisible: boolean;
  onBackdropPress?: () => void;
  confirmOnPressedCallback?: () => void;

  topTitle?: string;
  bottomTitle?: string;
  bottomView?: ReactElement;
  distanceDataList: any[];
  distanceData: any;
  closeButtonOnPressed?: () => void;
}

export default function ShowMeSelectDialog(props: Props): ReactElement {
  const dispatch = useDispatch();
  const { distanceSelected = null, isVisible, onBackdropPress = () => {}, topTitle, distanceDataList = [], distanceData = {} } = props;

  const [distanceSelectedTmp, setDistanceSelectedTmp] = useState(null);

  useEffect(() => {
    setDistanceSelectedTmp(distanceSelected);
  }, [distanceSelected]);

  const checkOnPressed = (itemSelected: any, _: number) => {
    dispatch(
      setFilterDistance(itemSelected === 'Km' ? 'Km' : 'Mi', distanceData.max, {
        onSuccess: () => onBackdropPress(),
        onFail: () => {},
      }),
    );
  };

  const onBack = () => {
    setDistanceSelectedTmp(distanceSelected);
    onBackdropPress && onBackdropPress();
  };

  return (
    <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={styles.wrapModal}>
      <View style={styles.container}>
        {/* Top View Area */}
        <View style={styles.topViewWrapper}>{<ModalBottomDialogTopView title={topTitle} closeButtonOnPressed={onBack} />}</View>

        {/* Middle View Area */}
        <View style={styles.middleViewWrapper}>
          {distanceDataList.length > 0 &&
            distanceDataList.map((item, index) => (
              <ShowDistanceItem key={item} item={item} index={index} checkOnPressed={checkOnPressed} itemSelected={distanceSelectedTmp} />
            ))}
        </View>

        {/* Bootom View Area */}
        <View style={styles.bottomViewWrapper}></View>
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
    height: 40,
    padding: 10,
    backgroundColor: colors.white,
  } as ViewStyle,
});
