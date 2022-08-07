import isEmpty from 'lodash/isEmpty';
import React, {createRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';

import {
  CONSTANTS,
  GLOBAL_ACTIONS,
  MAX_LENGTH,
  NEW_POST_MODAL_STATE,
} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {ICONS} from '../../../../assets/icons';
import CustomIcon from '../../../../assets/icons/CustomIcon';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS, normal, normalMedium, small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CheckboxList from '../../../../components/Checkbox/CheckboxList';
import DebounceInput from '../../../../components/DebounceInput';
import KeyboardScrollView from '../../../../components/KeyboardScrollView';
import RequiredLabel from '../../../../components/RequiredLabel';
import logService from '../../../../service/logService';
import {SCREEN_SIZE} from '../../../../utils/ImageUtil';
import NewPostAddFacilityScreen from '../../FacilityFurniture/NewPostAddFacilityScreen';
import FooterButtons from './FooterButtons';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: SCREEN_SIZE.HEIGHT / 2,
    minHeight: SCREEN_SIZE.HEIGHT / 2,
    ...METRICS.horizontalPadding,
    paddingTop: 0,
  },
  searchIcon: {},
  searchContainer: {
    ...HELPERS.center,
    ...HELPERS.row,
    ...METRICS.horizontalPadding,
    marginTop: normalMedium,
    height: 48,
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderColor: COLORS.GRAY_C9,
    borderWidth: SIZES.BORDER_WIDTH_1,
  },
  textSearch: {
    ...FONTS.regular,
    ...HELPERS.fill,
    color: COLORS.BLACK_33,
    fontSize: 14,
    lineHeight: 22,
    marginLeft: small,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.BLACK_33,
  },
  footerContainer: {
    ...commonStyles.footerContainer,
    marginBottom: normal,
    borderTopWidth: 1,
    borderTopColor: COLORS.SEPARATOR_LINE,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  emptyDataText: {
    fontSize: 20,
    alignSelf: 'center',
    color: COLORS.GRAY_BD,
  },
  emptyTextContainer: {
    marginTop: 16,
  },
  checkBoxListContainer: {
    flexDirection: 'column',
    paddingTop: 0,
  },
  itemStyle: {
    width: SCREEN_SIZE.WIDTH - normal * 2,
    height: CONSTANTS.ITEM_HEIGHT,
    ...HELPERS.selfCenter,
  },
  modalAddFacility: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  wrapperAddFacility: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

const mapStateToSelections = (state, limitNumber = MAX_LENGTH.MAX_FACILITIES) => {
  let initialData = [];
  if (state.modalizeState === NEW_POST_MODAL_STATE.ADD_AREA_FACILITY) {
    initialData = state.buildingFacility?.nearFacility ?? [];
  } else {
    initialData = state.buildingFacility?.internalFacility ?? [];
  }
  const isFull = initialData.filter(e => e.checked === true).length === limitNumber;
  const output = initialData.map((e, index) => {
    const disabled = e?.checked ? false : isFull;
    return {
      id: index,
      name: e.name,
      description: e.description,
      checked: e.checked ?? false,
      disabled: disabled,
    };
  });
  return output;
};

const mapSearchTextWithSelections = (searchText, selections) => {
  const copySelections = [...selections];
  if (!isEmpty(searchText)) {
    return copySelections.filter(e =>
      e?.description?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }
  return selections;
};

const NewPostAddFacilityModalContainer = ({
  title = '',
  searchTextPlaceHolder = '',
  state,
  dispatch,
  hideParentPopup,
  limitNumber = MAX_LENGTH.MAX_FACILITIES,
}) => {
  const [searchText, setSearchText] = useState('');
  const [originalList, setOriginalList] = useState(mapStateToSelections(state, limitNumber));
  const [selections, setSelections] = useState(mapStateToSelections(state, limitNumber));
  const [visibleModal, setVisibleModal] = useState(false);
  const scrollRef = createRef();
  const updateBuildingFacilityState = data => {
    dispatch({type: GLOBAL_ACTIONS.UPDATE_BUILDING_FACILITY, payload: data});
  };
  const updateState = data => {
    const input =
      state.modalizeState === NEW_POST_MODAL_STATE.ADD_AREA_FACILITY
        ? {nearFacility: data}
        : {internalFacility: data};
    updateBuildingFacilityState(input);
  };

  const setSelectionsWithSearch = (list, text) => {
    if (!isEmpty(text)) {
      setSelections(mapSearchTextWithSelections(text, list));
    } else {
      setSelections(list);
    }
  };
  const addItem = item => {
    const checkedSelectingListLength = originalList.filter(e => e.checked === true).length;
    const isFull = checkedSelectingListLength + 1 >= limitNumber;
    const selectionItems = originalList?.map(e => {
      if (!e.disabled && !e.checked && isFull) {
        e.disabled = true;
      }
      return {...e};
    });
    const newArr = [
      ...selectionItems,
      {
        ...item,
        id: originalList.length === 0 ? 0 : originalList[originalList.length - 1].id + 1,
        checked: true,
        disabled: false,
      },
    ];
    setOriginalList(newArr);
    setSelectionsWithSearch(newArr, searchText);
  };
  const onChangeSearchText = text => {
    setSearchText(text);
    setSelectionsWithSearch(originalList, text);

    try {
      scrollRef?.current?.scrollTo({
        y: 0,
        animated: true,
      });
    } catch (error) {
      logService.log('Error scrollview NewPostAddFacilityModalContainer', JSON.stringify(error));
    }
  };
  const dismissPopup = () => {
    setVisibleModal(false);
  };
  const showPopup = () => {
    setVisibleModal(true);
  };
  const onChosenFacility = (chosenItem, isChecked) => {
    const checkedSelectingListLength = originalList.filter(e => e.checked === true).length;
    const selectionItems = originalList?.map(e => {
      if (chosenItem?.id === e.id) {
        e.checked = isChecked;
        e.disabled = false;
      } else {
        if (isChecked) {
          const isFull = checkedSelectingListLength + 1 >= limitNumber;
          const disabled = e.checked ? false : isFull;
          e.disabled = disabled;
        } else {
          e.disabled = false;
        }
      }
      return {...e};
    });
    setOriginalList(selectionItems);
    setSelectionsWithSearch(selectionItems, searchText);
  };
  const onAddItemToList = items => {
    addItem(items);
    dismissPopup();
  };
  const onPressConfirm = () => {
    updateState(originalList);
    hideParentPopup();
  };

  const isFull = originalList?.filter(e => e.checked).length >= limitNumber;
  return (
    <>
      <KeyboardScrollView extraScrollHeight={-200}>
        <View style={styles.container}>
          <RequiredLabel
            style={METRICS.marginTopPlus}
            title={title}
            titleStyle={styles.headerTitle}
            isRequired={false}
          />
          <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
              <CustomIcon name={ICONS.SEARCH} size={24} color={COLORS.BLACK_33} />
            </View>
            <DebounceInput
              value={searchText}
              onChangeText={onChangeSearchText}
              autoFocus={false}
              delayTimeout={1000}
              returnKeyType={'search'}
              style={styles.textSearch}
              maxLength={MAX_LENGTH.default}
              placeholder={searchTextPlaceHolder}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <ScrollView
            style={METRICS.verticalMargin}
            ref={scrollRef}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollViewContentContainer}>
            {selections?.length > 0 ? (
              <CheckboxList
                customCheckedBox
                images={['checkbox', 'checkbox-blank-outline']}
                iconCheckedColor={COLORS.PRIMARY_A100}
                iconColor={COLORS.GRAY_C9}
                listStyle={styles.checkBoxListContainer}
                items={selections}
                onSelect={onChosenFacility}
                itemStyle={styles.itemStyle}
                selectedItems={selections?.filter(e => e.checked)}
                containerStyle={styles.checkBoxListContainer}
                separatorComponent={(item, index) => {
                  return <View key={item?.id + index} style={commonStyles.separatorRow4} />;
                }}
              />
            ) : (
              <View style={styles.emptyTextContainer}>
                <Text style={styles.emptyDataText}>{translate(STRINGS.DO_NOT_HAVE_DATA)}</Text>
              </View>
            )}
          </ScrollView>
        </View>
        <View style={styles.footerContainer}>
          <FooterButtons
            nextButtonTitle={translate(STRINGS.CONFIRM)}
            onPressNext={onPressConfirm}
            cancelButtonTitle={translate(STRINGS.ADD_FACILITY)}
            onPressCancel={showPopup}
            disabledCancel={isFull}
          />
        </View>
      </KeyboardScrollView>
      <Modal
        isVisible={visibleModal}
        avoidKeyboard={true}
        onBackdropPress={dismissPopup}
        style={styles.modalAddFacility}>
        <View style={styles.wrapperAddFacility}>
          <NewPostAddFacilityScreen
            onPressDismiss={dismissPopup}
            onAddItemToList={onAddItemToList}
          />
        </View>
      </Modal>
    </>
  );
};

export default NewPostAddFacilityModalContainer;
