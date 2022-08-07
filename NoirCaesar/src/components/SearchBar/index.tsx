import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
  TextInputSelectionChangeEventData,
  View,
  Platform,
} from 'react-native';
import React from 'react';
import { colors } from '@constants/vars';

import styles from './styles';

import translate from '@src/localize';
import { CustomTouchable } from '../CustomTouchable';

interface Props {
  leftIcon?: ImageSourcePropType;
  onSelectionChange?: (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
  onKeyPress?: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  onChange?: (event: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  multiLine?: boolean;
  selection?: any;
  rightIcon?: ImageSourcePropType;
  placeholder?: string;
  isLoading?: boolean;
  numberOfLines?: number;
  onTouchStart?: () => void;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'visible-password'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | undefined;
  onChangeText?: (text: string) => void;
  onPressRightIcon?: () => void;
  onFocus?: () => void;
  testSearch?: string;
}

export default class SearchBar extends React.Component<Props> {
  static defaultProps = {
    hasPlusIcon: false,
  };

  render() {
    const {
      leftIcon,
      placeholder,
      rightIcon,
      onChangeText,
      onPressRightIcon,
      testSearch,
      onSelectionChange,
      selection,
      onFocus,
      multiLine,
      keyboardType,
      onTouchStart,
      onKeyPress,
      onChange,
      numberOfLines,
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          {leftIcon ? <Image resizeMode="contain" source={leftIcon} /> : <Text style={styles.to}>{translate('searchbar.to')}</Text>}

          <TextInput
            onFocus={onFocus}
            keyboardType={keyboardType}
            numberOfLines={numberOfLines}
            onChange={onChange}
            selection={selection}
            multiline={multiLine}
            onSelectionChange={onSelectionChange}
            placeholder={placeholder}
            onTouchStart={onTouchStart}
            clearButtonMode="always"
            onChangeText={onChangeText}
            onKeyPress={onKeyPress}
            placeholderTextColor={colors.GRAY500}
            style={[styles.searchInput, Platform.OS === 'android' ? { paddingBottom: 6 } : {}]}
          >
            {testSearch}
          </TextInput>
          {this.props.isLoading ? <ActivityIndicator animating size="small" /> : null}
        </View>
        {rightIcon && (
          <CustomTouchable onPress={onPressRightIcon}>
            <Image style={styles.rightIcon} resizeMode="contain" source={rightIcon} />
          </CustomTouchable>
        )}
      </View>
    );
  }
}
