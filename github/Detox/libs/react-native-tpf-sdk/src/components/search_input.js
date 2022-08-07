import React, { useContext, useRef, useState } from 'react';
import { useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import themeContext from '../constants/theme/themeContext';
import { ICSearchField, ICSearchFieldCancel } from '../assets/icons';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../constants/colors';
import { SPACING } from '../constants/size';
import { translate } from '../i18n';
import { scale } from '../utils/responsive';

const selectText = createSelector(
  state => state.setting.lang,
  (_, children) => children,
  (_, children) => {
    return translate(children);
  }
);

const SearchInput = ({ onSearch, placeholder = '', style }) => {
  const ref = useRef();
  const [value, setValue] = useState('');
  const theme = useContext(themeContext);
  const onChangeText = useCallback(
    text => {
      setValue(text);
      onSearch(text);
    },
    [onSearch]
  );

  const placeholderTxt = useSelector(state =>
    selectText(state, placeholder ? placeholder : 'common.search')
  );

  return (
    <TouchableNativeFeedback
      onPress={() => {
        ref.current.focus();
      }}>
      <View style={[style]}>
        <View style={[styles.container]}>
          <TouchableOpacity style={styles.searchIcon} onPress={() => onSearch(value)}>
            <ICSearchField />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              ref={ref}
              numberOfLines={1}
              style={[
                styles.input,
                { color: theme?.text?.primary, fontFamily: theme?.fonts.REGULAR }
              ]}
              type="text"
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholderTxt}
              onEndEditing={() => onSearch(value)}
            />
          </View>
          {!!value && (
            <TouchableOpacity
              style={styles.cancelIcon}
              onPress={() => {
                setValue('');
                onSearch('');
              }}>
              <ICSearchFieldCancel />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(4),
    backgroundColor: CUSTOM_COLOR.WhiteGray,
    paddingTop: SPACING.Normal,
    paddingBottom: SPACING.Small,
    flexDirection: 'row'
  },
  inputContainer: {
    flex: 1
  },
  input: {
    padding: 0,
    fontSize: FONT_SIZE.BodyText,
    height: LINE_HEIGHT.BodyText,
    textAlignVertical: 'center'
  },
  searchIcon: {
    paddingHorizontal: SPACING.Normal
  },
  cancelIcon: {
    paddingHorizontal: SPACING.Normal
  }
});
