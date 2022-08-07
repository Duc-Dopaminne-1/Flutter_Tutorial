import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {List} from 'react-native-paper';

import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: 4,
    marginVertical: 5,
  },
  title: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
  },
  description: {
    ...FONTS.regular,
    fontSize: 12,
  },
  imageBackground: {
    alignSelf: 'flex-end',
    marginBottom: -8,
    position: 'absolute',
    right: 40,
    bottom: 0,
  },
});

const ViewRight = ({props, image}) => {
  return (
    <View style={[HELPERS.row]}>
      <Image style={styles.imageBackground} source={image} />
      <List.Icon {...props} icon="chevron-right" />
    </View>
  );
};

const MoreItem = ({item, onPress}) => {
  return (
    <List.Item
      title={item.title}
      description={item.description}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
      style={styles.viewContainer}
      right={props => <ViewRight props={props} image={item.image} />}
      onPress={onPress}
    />
  );
};

MoreItem.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func,
};

MoreItem.defaultProps = {
  onPress: () => {},
};

export default MoreItem;
