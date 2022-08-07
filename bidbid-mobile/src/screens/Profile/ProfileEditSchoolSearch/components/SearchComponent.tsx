import React, { useRef, useState, memo } from 'react';
import { View, TouchableOpacity, TextInput, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { colors, fonts } from '@/vars';
import { debounce, isEmpty } from 'lodash';
import CloseSearchSVG from '@/components/SVG/CloseSearchSVG';
import CloseSvg from '@/components/SVG/CloseSVG';
import SearchSVG from '@/components/SVG/SearchSVG';

const CONTAINER: ViewStyle = {
  flex: 1,
  height: 46,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  backgroundColor: colors.gray_100,
  borderRadius: 22,
  paddingHorizontal: 10,
};

const WRAP_CONTAINER: ViewStyle = {
  backgroundColor: 'white',
  borderRadius: 10,
  borderWidth: 0.5,
  borderColor: colors.gray_400,
};

const TEXT_INPUT_STYLE: any = {
  flex: 1,
  marginTop: 4,
  marginLeft: 10,
  color: colors.gray_700,
  fontSize: fonts.size.s14,
  paddingVertical: 0,
  fontFamily: fonts.family.PoppinsRegular,
};

const WRAPPER_CLEAN_ICON: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  padding: 3,
};

interface SearchComponentProps {
  style?: ViewStyle;
  inputData?: any[];
  searchField: string;
  onChangeSuggestResult?: (result: any[], keyWork: string) => void;
  apiSearch?: any;
  searchPlaceholderText: string;
  isFromContact?: boolean;
  searchFieldSecond: string;
}

function SearchComponent(props: SearchComponentProps) {
  const dispatch = useDispatch();
  const {
    searchFieldSecond,
    style,
    inputData,
    apiSearch,
    searchField,
    onChangeSuggestResult,
    searchPlaceholderText,
    isFromContact = false,
  } = props;
  const textInputRef = useRef(null);
  const [clearIconVisible, setClearIconVisible] = useState(false);
  const clearOnPressed = debounce(async () => {
    textInputRef.current.clear();
    setClearIconVisible(false);
    onChangeSuggestResult && onChangeSuggestResult(inputData, '');
  }, 200);

  const apiSearchHandler = (keyWork: string) => {
    dispatch(
      apiSearch({
        keywork: keyWork,
        callback: {
          onSuccess: item => {
            onChangeSuggestResult && onChangeSuggestResult(item, keyWork);
          },
          onFail: () => undefined,
        },
      }),
    );
  };

  const debounceSearchChange = debounce(async (text: string) => {
    setClearIconVisible(!isEmpty(text));
    if (apiSearch) {
      // CALL API SEARCH HERE with text , should using await here
      apiSearchHandler(text);
    } else {
      const resultData = inputData.reduce((resultArray, object) => {
        if (object.hasOwnProperty(searchField)) {
          const value = object[searchField];
          if (searchFieldSecond) {
            const valueSecond = object[searchFieldSecond];
            if (value.toLowerCase().includes(text.toLowerCase()) || valueSecond.toLowerCase().includes(text.toLowerCase())) {
              resultArray.push(object);
            }
          } else {
            if (value.toLowerCase().includes(text.toLowerCase())) {
              resultArray.push(object);
            }
          }
        }
        return resultArray;
      }, []);
      onChangeSuggestResult && onChangeSuggestResult(resultData as any[], text);
    }
  }, 600);

  return (
    <View style={[CONTAINER, style, isFromContact && WRAP_CONTAINER]}>
      {isFromContact && <SearchSVG />}
      <TextInput
        ref={textInputRef}
        style={TEXT_INPUT_STYLE}
        placeholder={searchPlaceholderText}
        placeholderTextColor={colors.gray_500}
        onChangeText={debounceSearchChange}
      />
      <TouchableOpacity style={WRAPPER_CLEAN_ICON} onPress={clearOnPressed}>
        {clearIconVisible ? isFromContact ? <CloseSearchSVG /> : <CloseSvg color={colors.red_700} /> : null}
      </TouchableOpacity>
    </View>
  );
}

export default memo(SearchComponent);
