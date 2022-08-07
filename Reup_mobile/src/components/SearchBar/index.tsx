import React from 'react';
import { View, ViewStyle } from 'react-native';
import styles from './styles';
import { SEARCH } from '@src/constants/icons';
import CustomInput from '../CustomInput';
import { Theme } from '../Theme';

type Props = {
  placeholder: string;
  onChangeText: (text: string) => void;
  styleContainer?: ViewStyle | ViewStyle[];
  value?: string
};

const SearchBar = (props: Props) => {

  const { placeholder, onChangeText, value = '', styleContainer } = props;

  return (
    <View style={[styles.container, styleContainer]}>
      <CustomInput
        onChangeText={onChangeText}
        autoCapitalize="none"
        rightIcon={SEARCH}
        autoCorrect={false}
        value={value}
        rightIconStyle={styles.searchIcon}
        placeholderTextColor={Theme.searchBar.placeholderText}
        placeholder={placeholder}
        inputStyle={styles.searchText}
      />
    </View>
  );
};

export default SearchBar;
