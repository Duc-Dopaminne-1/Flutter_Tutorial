import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {MAP_PROPERTY} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';

const ICON_SIZE = 20;
const styles = StyleSheet.create({
  touchable: {
    marginTop: SIZES.MARGIN_16,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.BORDER_RADIUS_8,
    height: 116,
    width: '22%',
  },
  title: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_10,
    fontSize: SIZES.FONT_16,
    lineHeight: SIZES.FONT_16_LINE_HEIGHT,
    marginTop: SIZES.MARGIN_4,
    marginBottom: SIZES.MARGIN_8,
  },
  wrapperImage: {
    backgroundColor: COLORS.PRIMARY_B10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.BORDER_RADIUS_100,
  },
});
const CheckboxWithText = ({checkedValue, title, item, onCheckItem}) => {
  const [checked, setChecked] = React.useState(checkedValue);
  const onCheckChange = () => {
    setChecked(!checked);
    item.checked = !checked;
    onCheckItem(item);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      key={title}
      style={styles.touchable}
      onPress={onCheckChange}>
      <View style={styles.wrapperImage}>
        <Image
          style={{width: ICON_SIZE, height: ICON_SIZE}}
          source={MAP_PROPERTY[item.name].icon}
        />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Icon
        color={checked ? COLORS.PRIMARY_A100 : COLORS.GREY_E4}
        size={24}
        name={checked ? 'check-box' : 'check-box-outline-blank'}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

CheckboxWithText.propTypes = {
  checkedValue: PropTypes.bool,
  title: PropTypes.string,
  item: PropTypes.object,
  onCheckItem: PropTypes.func,
};

CheckboxWithText.defaultProps = {
  checkedValue: false,
  title: '',
  item: {},
  onCheckItem: () => {},
};

export default CheckboxWithText;
