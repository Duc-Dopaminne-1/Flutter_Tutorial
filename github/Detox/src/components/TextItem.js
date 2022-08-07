import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';

import {COLORS} from '../assets/theme/colors';

const styles = StyleSheet.create({
  item: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    marginVertical: 4,
  },
});

const TextItem = ({title, onPress}) => {
  return (
    <List.Item
      style={styles.item}
      title={title}
      right={props => <List.Icon {...props} icon="chevron-right" />}
      onPress={onPress}
    />
  );
};

TextItem.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
};

TextItem.defaultProps = {
  title: '',
  onPress: () => {},
};

export default TextItem;
