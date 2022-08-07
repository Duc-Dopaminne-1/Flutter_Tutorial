import React, { FC, useCallback, useEffect, useState } from 'react';
import { TextInput, View, StyleSheet, FlatList, Pressable, Keyboard } from 'react-native';
import { debounce } from 'lodash';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';
import { useDispatch, useSelector } from 'react-redux';
import { searchIGUsername } from '@/redux/filters/actions';
import { FilterBottomView } from '../../Commons/FilterBottomView';
import { isAndroid } from '@/shared/devices';
import { RootState } from '@/redux/reducers';
import SearchSVG from '@/components/SVG/SearchSVG';

type SearchItem = {
  instagramUsername: string;
};

interface IGUsernameSearchFormProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
}

const IGUsernameSearchForm: FC<IGUsernameSearchFormProps> = ({ value, onChange, onSelect }) => {
  const dispatch = useDispatch();
  const instagramUsername = useSelector((state: RootState) => state.user.data.instagramUsername);
  const [searchResult, setSearchResult] = useState<SearchItem[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(isAndroid ? 'keyboardDidShow' : 'keyboardWillShow', event =>
      setKeyboardHeight(event.endCoordinates.height),
    );
    const keyboardDidHideListener = Keyboard.addListener(isAndroid ? 'keyboardDidHide' : 'keyboardWillHide', () => setKeyboardHeight(0));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const debounceSearch = useCallback(
    debounce(keyword => {
      if (keyword.length > 1) {
        dispatch(
          searchIGUsername(keyword, {
            onSuccess: data => {
              setSearchResult(data.filter(item => item.instagramUsername !== instagramUsername));
            },
          }),
        );
      } else {
        setSearchResult([]);
      }
    }, 500),
    [],
  );

  const handleQueryChange = useCallback(
    keyword => {
      onChange(keyword);
      debounceSearch(keyword);
    },
    [onChange],
  );

  const handleSave = useCallback(() => {
    onSelect(value.trim());
  }, [value]);

  const renderSearchBar = useCallback(
    () => (
      <View style={styles.searchBar}>
        <SearchSVG />
        <TextInput
          value={value}
          onChangeText={handleQueryChange}
          placeholderTextColor={colors.bg_tab}
          style={styles.searchInput}
          placeholder={language('profileGeneral.igUsername')}
          autoCapitalize="none"
        />
      </View>
    ),
    [value],
  );

  const handleSelectItem = useCallback((value: string) => {
    Keyboard.dismiss();
    onChange?.(value);
  }, []);

  const renderSearchItem = useCallback(({ item }: { item: SearchItem }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.searchItem, pressed && styles.searchItemPressed]}
        onPress={() => handleSelectItem(item.instagramUsername.trim())}
      >
        <DefaultText style={styles.searchItemLabel}>{item.instagramUsername}</DefaultText>
      </Pressable>
    );
  }, []);

  const renderFooter = useCallback(() => {
    return <FilterBottomView applyOnPressed={handleSave} />;
  }, [value]);

  return (
    <>
      {renderSearchBar()}
      <FlatList
        style={[styles.formWrapper, { height: 422 - keyboardHeight }]}
        contentContainerStyle={styles.formContainer}
        data={searchResult}
        keyboardShouldPersistTaps="handled"
        renderItem={renderSearchItem}
        keyExtractor={item => item.instagramUsername}
        showsVerticalScrollIndicator={false}
      />
      {renderFooter()}
    </>
  );
};

const styles = StyleSheet.create({
  formContainer: {},
  formWrapper: {},
  searchBar: {
    height: 42,
    paddingBottom: 0,
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    marginHorizontal: 24,
    borderColor: colors.placeholder_gray,
    borderBottomColor: colors.placeholder_gray,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchInput: {
    paddingVertical: 0,
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.black,
    fontSize: fonts.size.s17,
    flex: 1,
    flexGrow: 1,
    marginLeft: 10,
  },
  searchItem: {
    paddingVertical: 10,
    marginHorizontal: 24,
    paddingHorizontal: 35,
    backgroundColor: colors.gray_50,
  },
  searchItemPressed: {
    backgroundColor: colors.gray_100,
  },
  searchItemLabel: {
    color: colors.black,
    fontSize: fonts.size.s17,
  },
});

export default IGUsernameSearchForm;
