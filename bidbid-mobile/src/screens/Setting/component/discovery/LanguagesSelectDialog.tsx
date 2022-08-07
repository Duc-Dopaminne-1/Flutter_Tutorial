import React, { ReactElement, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, ViewStyle, View, FlatList } from 'react-native';
import { colors } from '@/vars';
import Modal from 'react-native-modal';
import ModalBottomDialogTopView from '../ModalBottomDialogTopView';
import { setFilterLanguages } from '@/redux/filters/actions';
import LanguagesItem from './LanguagesItem';
import { useDispatch } from 'react-redux';
import { getLanguages } from '@/redux/user/actions';
import { FilterBottomView } from '@/screens/Filter/Commons/FilterBottomView';
import { FilterLineBreak } from '@/screens/Filter/Commons/FilterLineBreak';
import { FilterBodyView } from '@/screens/Filter/Commons/FilterBodyView';
import ModalLoading from '@/components/ModalLoading';
import { languagesCodeHighPriority } from '@/i18n';

const ITEM_HEIGHT = 50;

const sortAlphabest = (array: any[]) => {
  return array.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
};

interface Props {
  languagesList: any[];
  languagesSelectedList: any[];
  isVisible: boolean;
  onBackdropPress?: () => void;
  confirmOnPressedCallback?: () => void;

  topTitle?: string;
  bottomTitle?: string;
  bottomView?: ReactElement;
}

export default function LanguagesSelectDialog(props: Props): ReactElement {
  const dispatch = useDispatch();

  const {
    languagesList = [],
    languagesSelectedList = [],
    isVisible,
    onBackdropPress = () => {},
    confirmOnPressedCallback = () => {},
    topTitle,
    bottomTitle,
  } = props;

  const [languageSelectedTmp, setLanguageSelectedTmp] = useState({});
  const [loading, setLoading] = useState(false);
  const languageSelectedDefault = useRef({});

  const [languagesListShowDefault, setLanguagesListShowDefault] = useState([]);

  // Fetch Data
  useEffect(() => {
    if (!languagesList || languagesList.length < 1) {
      dispatch(getLanguages({}));
    } else {
      let results = {
        languagesSelected: [],
        languagesHighPriority: [],
        languagesUnSelect: [],
      };
      languagesList.reduce((currentResult, currentLanguage) => {
        if (languagesSelectedList.some(item => item.id === currentLanguage.id)) {
          currentResult.languagesSelected.push(currentLanguage);
        } else {
          if (languagesCodeHighPriority.includes(currentLanguage.code)) {
            currentResult.languagesHighPriority.push(currentLanguage);
          } else {
            currentResult.languagesUnSelect.push(currentLanguage);
          }
        }
        return currentResult;
      }, results);
      const languagesSelectedSorted = sortAlphabest(results.languagesSelected);
      const languagesHighPrioritySorted = sortAlphabest(results.languagesHighPriority);
      const languagesUnSelectedSorted = sortAlphabest(results.languagesUnSelect);
      setLanguagesListShowDefault([...languagesSelectedSorted, ...languagesHighPrioritySorted, ...languagesUnSelectedSorted]);
    }
  }, [languagesList]);

  useLayoutEffect(() => {
    const dictionary = languagesSelectedList.reduce((dic, currentItem) => {
      dic[currentItem.id] = currentItem;
      return dic;
    }, {});
    languageSelectedDefault.current = dictionary;
    setLanguageSelectedTmp({ ...dictionary });
  }, [languagesSelectedList]);

  const boxCheckSelected = useCallback(
    (itemSelected: any, _: number) => {
      if (!languageSelectedTmp[itemSelected.id]) {
        languageSelectedTmp[itemSelected.id] = itemSelected;
      } else {
        delete languageSelectedTmp[itemSelected.id];
      }
      setLanguageSelectedTmp({ ...languageSelectedTmp });
    },
    [languageSelectedTmp],
  );

  const saveLanguagesOnPressed = async () => {
    setLoading(true);
    const values: { id: string; name: string }[] = Object.values(languageSelectedTmp) || [];
    const convertData = values.map(item => {
      return {
        id: item.id,
        name: item.name,
      };
    });
    dispatch(
      setFilterLanguages(convertData, {
        onSuccess: () => {
          setLoading(false);
          confirmOnPressedCallback();
        },
        onFail: () => {
          setLoading(false);
          confirmOnPressedCallback();
        },
      }),
    );
  };

  const onBack = () => {
    onBackdropPress && onBackdropPress();
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      const isSelected = languageSelectedTmp[item.id] ? true : false;
      return <LanguagesItem key={item.name} item={item} index={index} boxCheckSelected={boxCheckSelected} isSelected={isSelected} />;
    },
    [languageSelectedTmp],
  );

  const SeparatorView = () => useMemo(() => <View style={styles.viewLine} />, []);
  const keyExtractor = useCallback((item: any) => item.id.toString(), []);
  const getItemLayout = useCallback((_item: any, index: number) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }), []);

  return (
    <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={styles.wrapModal}>
      <View style={styles.container}>
        <View style={styles.wrapBody}>
          {/* Top View Area */}
          <View style={styles.topViewWrapper}>
            <ModalBottomDialogTopView title={topTitle} closeButtonOnPressed={onBack} />
          </View>

          <FilterLineBreak />

          <FilterBodyView style={styles.bodyViewWrapper}>
            {/* Middle View Area */}
            <View style={styles.middleViewWrapper}>
              {languagesListShowDefault && languagesListShowDefault.length > 0 && (
                <FlatList
                  // scrollToOverflowEnabled={false}
                  data={languagesListShowDefault}
                  renderItem={renderItem}
                  ItemSeparatorComponent={SeparatorView}
                  keyExtractor={keyExtractor}
                  initialNumToRender={10}
                  getItemLayout={getItemLayout}
                  windowSize={5}
                />
              )}
            </View>
          </FilterBodyView>

          {/* Bottom View Area */}
          <FilterBottomView title={bottomTitle} applyOnPressed={saveLanguagesOnPressed} />
        </View>
      </View>
      {loading && <ModalLoading isVisible={loading} />}
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

  wrapBody: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  } as ViewStyle,

  viewLine: {
    flex: 1,
    height: 0.7,
    backgroundColor: colors.separator_line,
  },

  bodyViewWrapper: {
    height: 400,
  },
});
