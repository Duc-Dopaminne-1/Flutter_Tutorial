import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import { colors } from '@/vars';

import Modal from 'react-native-modal';
import ModalBottomDialogTopView from '../ModalBottomDialogTopView';
import AppButton from '../discovery/AppButton';
import SettingLanguagesAppItem from './SettingLanguagesAppItem';
import { supportedLanguages } from '@/i18n';

interface Props {
  languageSelected: any;

  isVisible: boolean;
  onBackdropPress?: () => void;
  confirmOnPressedCallback?: (locale: string) => void;

  topTitle?: string;
  bottomTitle?: string;
  bottomView?: ReactElement;
}

export default function SettingLanguagesApp(props: Props): ReactElement {
  const {
    languageSelected = 'en',
    isVisible,
    onBackdropPress = () => {},
    confirmOnPressedCallback = () => {},
    topTitle,
    bottomTitle,
  } = props;

  const [dataList, setDataList] = useState([]);
  const [dataSelectTemp, setDataSelectTemp] = useState();

  useEffect(() => {
    setDataSelectTemp(languageSelected);
  }, [languageSelected]);

  useEffect(() => {
    setDataList(supportedLanguages);
  }, []);

  const checkOnPressed = (itemSelected: any, _: number) => {
    setDataSelectTemp(itemSelected);
  };

  const saveLanguagesOnPressed = async () => {
    confirmOnPressedCallback(dataSelectTemp);
  };

  const onBack = () => {
    setDataSelectTemp(languageSelected);
    onBackdropPress && onBackdropPress();
  };

  return (
    <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={styles.wrapModal}>
      <View style={styles.container}>
        {/* Top View Area */}
        <View style={styles.topViewWrapper}>
          <ModalBottomDialogTopView title={topTitle} closeButtonOnPressed={onBack} />
        </View>

        {/* LineBreak View */}
        <View style={styles.lineBreakView} />

        {/* Middle View Area */}

        <View style={styles.middleViewWrapper}>
          {dataList.length > 0 &&
            dataList.map((item, index) => (
              <SettingLanguagesAppItem key={item} item={item} index={index} checkOnPressed={checkOnPressed} itemSelected={dataSelectTemp} />
            ))}
        </View>

        {/* Bootom View Area */}
        <View style={styles.bottomViewWrapper}>
          <AppButton
            title={bottomTitle}
            onPressed={() => {
              saveLanguagesOnPressed();
            }}
          />
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

  lineBreakView: {
    backgroundColor: colors.separator_line,
    height: 1,
  } as ViewStyle,

  topViewWrapper: {
    padding: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

  middleViewWrapper: {
    backgroundColor: colors.white,
  } as ViewStyle,

  bottomViewWrapper: {
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
  } as ViewStyle,
});
