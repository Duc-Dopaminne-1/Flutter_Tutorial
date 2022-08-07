import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {IMAGES} from '../assets/images';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {commonStyles} from '../assets/theme/styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  textTitle: {
    ...FONTS.regular,
    ...commonStyles.txtFontSize14,
    color: COLORS.GRAY_A3,
  },
  textValue: {
    ...FONTS.regular,
    ...commonStyles.txtFontSize14,
    color: COLORS.BLACK_31,
  },
  separator: {
    width: 16,
  },
  iconRightArrowContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRightArrow: {
    width: '100%',
    height: '100%',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueContainer: {
    ...HELPERS.fill,
  },
  hidden: {
    opacity: 0,
  },
});

const TextView = ({
  title,
  value,
  valueLines = 1,
  separatorWidth,
  titleStyle,
  valueStyle,
  canBeInteractive = false,
  hideTitle = false,
  disableTitle = false,
  customRightComponent = null,
  customLeftComponent = null,
  containerStyle = {},
  valueContainerStyle = {},
  onPress,
}) => {
  const getSeparatorWidth = width => {
    if (!width) {
      return styles.separator;
    }
    return [styles.separator, {width}];
  };

  const renderValueSection = () => {
    if (customRightComponent) {
      return customRightComponent;
    }

    if (canBeInteractive) {
      return (
        <View style={[styles.valueContainer, valueContainerStyle]}>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={[styles.textValue, valueStyle]} numberOfLines={valueLines}>
              {value}
            </Text>
            <View style={styles.iconRightArrowContainer}>
              <Image source={IMAGES.IC_RIGHT_ARROW} style={styles.iconRightArrow} />
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Text numberOfLines={valueLines} style={[styles.textValue, valueStyle]}>
        {value}
      </Text>
    );
  };

  const renderTitleSection = () => {
    if (disableTitle) {
      return <></>;
    }

    if (hideTitle) {
      return (
        <View style={styles.hidden}>
          <Text style={[styles.textTitle, titleStyle]}>{title}</Text>
        </View>
      );
    }

    if (customLeftComponent) {
      return customLeftComponent;
    }

    return (
      <>
        <Text style={[styles.textTitle, titleStyle]}>{title}</Text>
      </>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderTitleSection()}
      {separatorWidth !== 0 && <View style={getSeparatorWidth(separatorWidth)} />}
      {renderValueSection()}
    </View>
  );
};

TextView.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  separatorWidth: PropTypes.number,
  titleStyle: PropTypes.object,
  valueStyle: PropTypes.object,
  onPress: PropTypes.func,
};

TextView.defaultProps = {
  title: '',
  value: '',
  separatorWidth: 16,
  titleStyle: {},
  valueStyle: {},
};

export default TextView;
