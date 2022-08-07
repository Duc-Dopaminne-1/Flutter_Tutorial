import React, { useMemo } from 'react';
import { View, Image } from 'react-native';
import CustomInput from '@src/components/CustomInput';
import SEARCH_ICON from '@res/icons/searchSmall.png';
import styles from './styles';

interface Props {
  search: string;
  onSearchTextChange: (text: string) => void;
}

const SearchChannel = (props: Props) => {
  const { search, onSearchTextChange } = props;
  const searchView = useMemo(() => {
    return (
      <View style={styles.containerSearch}>
        <Image source={SEARCH_ICON} style={styles.iconNoItem} />
        <CustomInput
          onChangeText={onSearchTextChange}
          placeholder={'Search by name'}
          moreStyle={styles.search}
          value={search}
          inputStyle={{ color: '#0F0F13' }}
          containerStyle={styles.containerStyle}
          placeholderTextColor={'#0F0F13'}
        />
      </View>
    );
  }, [search]);

  return searchView;
};

export default SearchChannel;
