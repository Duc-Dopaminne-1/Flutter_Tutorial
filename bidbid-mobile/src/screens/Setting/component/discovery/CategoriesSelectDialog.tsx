import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import { colors } from '@/vars';

import Modal from 'react-native-modal';
import ModalBottomDialogTopView from '../ModalBottomDialogTopView';
import AppButton from './AppButton';
import { getFilterCategories, setFilterCategories } from '@/redux/filters/actions';
import CategoriesItem from './CategoriesItem';
import { useDispatch } from 'react-redux';

interface Props {
  dataSelectedList: any[];

  isVisible: boolean;
  onBackdropPress?: () => void;
  confirmOnPressedCallback?: () => void;

  topTitle?: string;
  bottomTitle?: string;
  bottomView?: ReactElement;

  closeButtonOnPressed?: () => void;
}

export default function ShowMeListView(props: Props): ReactElement {
  const dispatch = useDispatch();

  const {
    dataSelectedList = [],
    isVisible,
    onBackdropPress = () => {},
    // closeButtonOnPressed = () => {},
    confirmOnPressedCallback = () => {},
    topTitle,
    bottomTitle,
  } = props;

  const [dataList, setDataList] = useState([]);
  const [dataSelectTemp, setDataSelectTemp] = useState([]);

  useEffect(() => {
    setDataSelectTemp(dataSelectedList);
  }, [dataSelectedList]);

  useEffect(() => {
    dispatch(
      getFilterCategories({
        onSuccess: items => {
          setDataList([...items]);
        },
        onFail: (_message: string) => {
          setDataList([]);
        },
      }),
    );
  }, []);

  const boxCheckSelected = (itemSelected: any, _: number) => {
    let newArray = [...dataSelectTemp];
    if (dataSelectTemp.some(item => item.id === itemSelected.id)) {
      newArray = dataSelectTemp.filter(item => item.id !== itemSelected.id);
    } else {
      newArray.push(itemSelected);
    }
    setDataSelectTemp(newArray);
  };

  const saveCategoriesOnPressed = async () => {
    if (dataSelectTemp && dataSelectTemp.length > 0) {
      const categories = dataSelectTemp.map(item => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      dispatch(
        setFilterCategories(categories, {
          onSuccess: () => {
            confirmOnPressedCallback();
          },
          onFail: () => {
            confirmOnPressedCallback();
          },
        }),
      );
    } else {
      dispatch(
        setFilterCategories([], {
          onSuccess: () => {
            confirmOnPressedCallback();
          },
          onFail: () => {
            confirmOnPressedCallback();
          },
        }),
      );
    }
  };

  const onBack = () => {
    setDataSelectTemp(dataSelectedList);
    onBackdropPress && onBackdropPress();
  };

  return (
    <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={styles.wrapModal}>
      <View style={styles.container}>
        {/* Top View Area */}
        <View style={styles.topViewWrapper}>{<ModalBottomDialogTopView title={topTitle} closeButtonOnPressed={onBack} />}</View>

        {/* LineBreak View */}
        <View style={styles.lineBreakView} />

        {/* Middle View Area */}

        <View style={styles.middleViewWrapper}>
          {dataList.length > 0 &&
            dataList.map((item, index) => (
              <CategoriesItem
                key={item.name}
                item={item}
                index={index}
                boxCheckSelected={boxCheckSelected}
                dataSelectedList={dataSelectTemp}
              />
            ))}
        </View>

        {/* Bootom View Area */}
        <View style={styles.bottomViewWrapper}>
          <AppButton
            title={bottomTitle}
            onPressed={() => {
              saveCategoriesOnPressed();
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
    padding: 10,
    backgroundColor: colors.white,
  } as ViewStyle,

  bottomViewWrapper: {
    height: 100,
    padding: 10,
    backgroundColor: colors.white,
  } as ViewStyle,
});
