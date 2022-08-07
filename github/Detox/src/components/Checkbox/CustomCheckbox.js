import PropTypes from 'prop-types';
import React, {useEffect, useMemo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View, ViewPropTypes} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {IMAGES} from '../../assets/images';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    ...FONTS.regular,
    paddingLeft: 8,
    // set default color (fix: on Android, change state disable <=> text color is white)
    color: COLORS.BLACK_33,
  },
  icon: {
    paddingTop: 2,
  },
  description: {
    fontSize: 12,
    ...FONTS.regular,
    paddingLeft: 8,
  },
  checkedImage: {
    height: 12,
    width: 16,
  },
});

const getRightComponent = ({
  customCheckedBox,
  imageChecked,
  images,
  iconCheckedColor,
  iconColor,
}) => {
  return customCheckedBox ? (
    <>
      {imageChecked && (
        <MaterialIcons name={images[0]} size={24} color={iconCheckedColor} style={styles.icon} />
      )}
      {imageChecked || (
        <MaterialIcons name={images[1]} size={24} color={iconColor} style={styles.icon} />
      )}
    </>
  ) : (
    <View style={styles.rightComponent}>
      {imageChecked && (
        <Image source={IMAGES.IC_CHECK_SUCCESS} style={styles.checkedImage} resizeMode="contain" />
      )}
    </View>
  );
};

const CustomCheckbox = ({
  parentCheckedValue,
  checkValue,
  title,
  style,
  shouldGetValueOutSide,
  images,
  disabled,
  lockValue = false,
  textStyle,
  iconColor,
  iconCheckedColor,
  onChange,
  hitSlop,
  description,
  descriptionStyle,
  titleView = null,
  isTitleInsideButton = true,
  isIconLeft = true,
  customCheckedBox = false,
  titleContainerStyle,
}) => {
  const [checked, setChecked] = React.useState(parentCheckedValue);

  useEffect(() => {
    setChecked(parentCheckedValue);
  }, [parentCheckedValue]);

  const onCheckChange = () => {
    const result = shouldGetValueOutSide ? !parentCheckedValue : !checked;
    setChecked(result);
    checkValue(result);
    if (typeof onChange === 'function') {
      onChange(result);
    }
  };

  const onChangeValue = () => (shouldGetValueOutSide ? parentCheckedValue : checked);

  const imageChecked = useMemo(onChangeValue, [
    parentCheckedValue,
    shouldGetValueOutSide,
    checked,
    onChangeValue,
  ]);

  // if disabled state, color text last of array style
  const titleStyle = disabled ? [styles.title, {color: COLORS.GREY_CB}] : styles.title;

  const descriptionView = (
    <View style={titleContainerStyle}>
      {!!title && <Text style={[titleStyle, textStyle]}>{title}</Text>}
      {!!description && <Text style={[styles.description, descriptionStyle]}>{description}</Text>}
      {titleView}
    </View>
  );

  const checkBoxView = (
    <TouchableOpacity
      style={[HELPERS.row, styles.container, isIconLeft || HELPERS.mainSpaceBetween, style]}
      onPress={onCheckChange}
      disabled={disabled || lockValue}
      activeOpacity={0.8}
      hitSlop={hitSlop}>
      {isIconLeft && (
        <>
          {customCheckedBox || (
            <Icon
              name={imageChecked ? images[0] : images[1]}
              size={24}
              color={imageChecked ? iconCheckedColor : iconColor}
              style={styles.icon}
            />
          )}
          {customCheckedBox && (
            <>
              {imageChecked && (
                <IonIcon name={images[0]} size={24} color={iconCheckedColor} style={styles.icon} />
              )}
              {imageChecked || (
                <Icon name={images[1]} size={24} color={iconColor} style={styles.icon} />
              )}
            </>
          )}
        </>
      )}
      {(isTitleInsideButton || !isIconLeft) && descriptionView}
      {isIconLeft ||
        getRightComponent({customCheckedBox, imageChecked, images, iconCheckedColor, iconColor})}
    </TouchableOpacity>
  );

  return isTitleInsideButton || !isIconLeft ? (
    checkBoxView
  ) : (
    <View style={[HELPERS.row, styles.container, style]}>
      {checkBoxView}
      {descriptionView}
    </View>
  );
};

CustomCheckbox.propTypes = {
  parentCheckedValue: PropTypes.bool,
  checkValue: PropTypes.func,
  title: PropTypes.string,
  style: ViewPropTypes.style,
  shouldGetValueOutSide: PropTypes.bool,
  images: PropTypes.array,
  disabled: PropTypes.bool,
  iconColor: PropTypes.string,
  iconCheckedColor: PropTypes.string,
};

CustomCheckbox.defaultProps = {
  parentCheckedValue: false,
  checkValue: () => {},
  title: '',
  shouldGetValueOutSide: false,
  images: ['check-box-outline', 'checkbox-blank-outline'],
  disabled: false,
  iconColor: COLORS.GREY_E4,
  iconCheckedColor: COLORS.PRIMARY_A100,
};

export default CustomCheckbox;
