import { Gender } from '@/models';
import { setFilterGender } from '@/redux/filters/actions';
import { colors } from '@/vars';
import React, { ReactElement, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux';
import ModalBottomDialogTopView from '../ModalBottomDialogTopView';
import AppButton from './AppButton';
import ShowMeItem from './ShowMeItem';
import ModalLoading from '@/components/ModalLoading';

interface Props {
  genderSelected?: any;
  genderList: any[];
  isVisible: boolean;
  onBackdropPress?: () => void;
  confirmOnPressedCallback?: () => void;
  onModalHide?: () => void;
  topTitle?: string;
  bottomTitle?: string;
  bottomView?: ReactElement;

  closeButtonOnPressed?: () => void;
}

interface GenderHash {
  [id: string]: Gender;
}

export default function ShowMeSelectDialog(props: Props): ReactElement {
  const dispatch = useDispatch();

  const {
    genderSelected = [],
    genderList = [],
    isVisible,
    onBackdropPress = () => {},
    topTitle,
    bottomTitle,
    confirmOnPressedCallback = () => {},
  } = props;

  const [genderSelectedTmp, setGenderSelectedTmp] = useState<GenderHash>({});
  const [loading, setLoading] = useState(false);
  const genderSelectedDefault = useRef<GenderHash>();

  useLayoutEffect(() => {
    const dictionary = genderSelected.reduce((dic, currentItem) => {
      dic[currentItem.id] = currentItem;
      return dic;
    }, {});
    genderSelectedDefault.current = dictionary;
    setGenderSelectedTmp({ ...dictionary });
  }, [genderSelected]);

  const onSuccessHandler = () => {
    confirmOnPressedCallback();
    setLoading(false);
  };

  const onFailedHandler = () => {
    setLoading(false);
  };

  const getIsEditing = (): boolean => {
    let isEditing = false;
    if (Object.values(genderSelectedTmp).length != genderSelected.length) {
      isEditing = true;
    } else {
      genderSelected.map(item => {
        if (!genderSelectedTmp[item.id]) isEditing = false;
      });
    }
    return isEditing;
  };

  const saveShowMeOnPressed = async () => {
    if (!getIsEditing()) return onBack();
    setLoading(true);
    const genders = Object.values(genderSelectedTmp).map(item => {
      return {
        id: item.id,
        name: item.name,
      };
    });
    dispatch(
      setFilterGender(genders, {
        onSuccess: () => onSuccessHandler(),
        onFail: () => onFailedHandler(),
      }),
    );
  };

  const boxCheckSelected = useCallback(
    (itemSelected: any, _: number) => {
      if (!genderSelectedTmp[itemSelected.id]) {
        genderSelectedTmp[itemSelected.id] = itemSelected;
      } else {
        delete genderSelectedTmp[itemSelected.id];
      }
      setGenderSelectedTmp({ ...genderSelectedTmp });
    },
    [genderSelectedTmp],
  );

  const onBack = () => {
    setGenderSelectedTmp({ ...genderSelectedDefault.current });
    onBackdropPress && onBackdropPress();
  };

  return (
    <>
      <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={styles.wrapModal}>
        <View style={styles.container}>
          {/* Top View Area */}
          <View style={styles.topViewWrapper}>{<ModalBottomDialogTopView title={topTitle} closeButtonOnPressed={onBack} />}</View>

          {/* LineBreak View */}
          <View style={styles.lineBreakView} />

          {/* Middle View Area */}

          <View style={styles.middleViewWrapper}>
            {genderList.length > 0 &&
              genderList.map((item, index) => (
                <ShowMeItem
                  key={item.id}
                  item={item}
                  index={index}
                  isSelected={genderSelectedTmp[item.id] ? true : false}
                  boxCheckSelected={boxCheckSelected}
                />
              ))}
          </View>

          {/* Bootom View Area */}
          <View style={styles.bottomViewWrapper}>
            <AppButton
              title={bottomTitle}
              onPressed={() => {
                saveShowMeOnPressed();
              }}
            />
          </View>
        </View>
        {loading && <ModalLoading isVisible={loading} />}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.transparent,
  } as ViewStyle,

  wrapModal: {
    margin: 0,
    justifyContent: 'flex-end',
    zIndex: 1,
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
