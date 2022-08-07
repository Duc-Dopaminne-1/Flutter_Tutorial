import { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { colors } from '@src/constants/vars';
import { styles } from './styles';

export default class LoadingPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.LIGHT_GREY} />
      </View>
    );
  }
}
