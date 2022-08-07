import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import DropdownIcon from '@src/res/icons/dropdown-icon/dropdown-icon.png';

// interface Props {
//   title?: string,
//   onPress?: () => void
// }

const DropdownView = (props: any) => {
  const { title, onPress } = props;
  return (
    <View style={styles.parentView}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Image source={DropdownIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DropdownView;
