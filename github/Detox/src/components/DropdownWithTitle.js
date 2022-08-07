import PropsTypes from 'prop-types';
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import {StyleSheet, Text, View, ViewPropTypes} from 'react-native';
import Select2 from 'react-native-select-two';

import {FONT_REGULAR} from '../assets/fonts';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {normal} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import ErrorText from '../components/ErrorText';
import DropdownIcon from './DropdownIcon';
import RequiredStar from './RequiredStar';

const styles = StyleSheet.create({
  headerTitle: {
    paddingTop: 4,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
    ...FONTS.bold,
  },
  dropdown: {
    ...commonStyles.dropdown,
    paddingRight: normal,
  },
});

const DropdownWithTitle = forwardRef(
  (
    {
      style,
      inputStyle,
      title,
      dropdownTitle,
      popupTitle,
      items,
      error,
      itemSelected,
      onChosen,
      headerStyles,
      showSearchBox = true,
      isRequired = false,
      emptyText = translate(STRINGS.DO_NOT_HAVE_DATA),
      disabled = false,
      isSelectSingle = true,
      isRequiredAtLeastOne = true,
      isHaveAll = false,
      onRemoveItem,
      value = false,
      onChangeText = false,
      canSearchServer = false,
      removeDelete = false,
      dropdownIconStyle = {},
      dropdownPlaceHolderStyle = {},
      selectedStyle = {},
      colorTheme = COLORS.PRIMARY_A100,
      placeholder,
      stylePlaceholder,
    },
    ref,
  ) => {
    const [item, setItem] = React.useState({});

    const modalSelectRef = useRef();

    useEffect(() => {
      itemSelected(item);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    useImperativeHandle(ref, () => ({
      showModal,
    }));

    const showModal = () => modalSelectRef.current?.showModal();

    const onItemSelect = (_, selectedItems) => {
      if (isSelectSingle) {
        const selected = selectedItems ? selectedItems[0] : {};
        setItem(selected);
        onChosen(selected);
      } else {
        onChosen(selectedItems);
      }
    };

    const selectedTitleStyle = () => {
      const hasSelection = items.find(e => e?.checked === true);
      if (!item?.id && !hasSelection) {
        return dropdownPlaceHolderStyle;
      } else {
        return {...selectedStyle};
      }
    };
    const selectedTitleInputStyle = selectedTitleStyle();

    return (
      <View style={style}>
        {!!title && (
          <View style={HELPERS.row}>
            <Text style={[styles.headerTitle, headerStyles]}>
              {title} {isRequired && <RequiredStar />}
            </Text>
          </View>
        )}
        <View pointerEvents={disabled ? 'none' : 'auto'}>
          <Select2
            ref={refSelect => (modalSelectRef.current = refSelect)}
            isSelectSingle={isSelectSingle}
            style={{
              ...styles.dropdown,
              ...{backgroundColor: disabled ? COLORS.NEUTRAL_DISABLE : COLORS.NEUTRAL_WHITE},
              ...inputStyle,
            }}
            defaultFontName={FONT_REGULAR}
            colorTheme={colorTheme}
            popupTitle={popupTitle}
            title={dropdownTitle}
            data={items}
            value={value}
            canSearchServer={canSearchServer}
            showSearchBox={showSearchBox}
            onSelect={onItemSelect}
            onChangeText={onChangeText}
            listEmptyTitle={emptyText}
            isRequiredAtLeastOne={isRequiredAtLeastOne}
            onRemoveItem={onRemoveItem}
            isHaveAll={isHaveAll}
            removeDelete={removeDelete}
            cancelButtonText={translate(STRINGS.CANCEL)}
            selectButtonText={translate(STRINGS.SELECT)}
            searchPlaceHolderText={translate(STRINGS.ENTER_SEARCH_KEY)}
            selectedTitleStyle={selectedTitleInputStyle}
            placeholder={placeholder}
            stylePlaceholder={stylePlaceholder}
          />
          <DropdownIcon disabled={disabled} style={dropdownIconStyle} onPress={showModal} />
        </View>
        <ErrorText errorText={error} />
      </View>
    );
  },
);

DropdownWithTitle.propTypes = {
  style: ViewPropTypes.style,
  title: PropsTypes.string,
  dropdownTitle: PropsTypes.string,
  popupTitle: PropsTypes.string,
  items: PropsTypes.array,
  showSearchBox: PropsTypes.bool,
  error: PropsTypes.string,
  itemSelected: PropsTypes.func,
  onChosen: PropsTypes.func,
  isSelectSingle: PropsTypes.bool,
  isRequiredAtLeastOne: PropsTypes.bool,
  onRemoveItem: PropsTypes.func,
  isHaveAll: PropsTypes.bool,
  inputStyle: ViewPropTypes.style,
  placeholder: PropsTypes.string,
  stylePlaceholder: PropsTypes.object,
};

DropdownWithTitle.defaultProps = {
  style: {},
  inputStyle: {},
  title: '',
  dropdownTitle: '',
  popupTitle: '',
  items: [],
  showSearchBox: false,
  error: '',
  isSelectSingle: true,
  itemSelected: () => {},
  onChosen: () => {},
  isRequiredAtLeastOne: true,
  onRemoveItem: () => {},
  isHaveAll: false,
};

export default DropdownWithTitle;
