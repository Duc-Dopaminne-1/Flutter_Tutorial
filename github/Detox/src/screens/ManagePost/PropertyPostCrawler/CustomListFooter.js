import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import ScrollViewFooter from '../../../components/ScrollViewFooter';

export default class CustomListFooter extends ScrollViewFooter {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.content}>
        <Text style={styles.title}>{this.getTitle()}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {bottom: 250},
  title: {textAlign: 'center'},
});
