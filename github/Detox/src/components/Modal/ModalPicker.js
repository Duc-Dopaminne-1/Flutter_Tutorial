import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS} from '../../assets/theme/metric';
import ModalPopup from './ModalPopup';

const styles = StyleSheet.create({
  viewInside: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  iosRectangle: {
    width: 40,
    height: 3,
    alignSelf: 'center',
    marginTop: 8,
  },
  contentContainer: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_10,
    paddingBottom: 44,
  },

  titleContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_40,
  },

  actionText: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_10,
    marginLeft: 12,
  },

  cancelContainer: {
    backgroundColor: COLORS.BACKGROUND,
    padding: 16,
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: SIZES.BORDER_RADIUS_10,
  },
  cancelText: {
    ...FONTS.regular,
    color: COLORS.STATE_ERROR,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.PRIMARY_A100,
  },
  separator: {
    height: 22,
  },
});

const ModalPicker = ({showPicker, setShowPicker, items, onChooseAction}) => {
  const onDismissPopup = () => {
    setShowPicker(false);
  };

  const onSelect = selection => {
    onChooseAction(selection);
  };

  return (
    <>
      {showPicker && (
        <ModalPopup
          visible={showPicker}
          onPressOutSide={onDismissPopup}
          animationType="slide"
          contentContainerStyle={{...HELPERS.mainEnd, ...METRICS.resetPadding}}>
          <View style={styles.viewInside}>
            <View style={styles.contentContainer}>
              <Image source={IMAGES.IC_IOS_RECTANGLE} style={styles.iosRectangle} />
              <View style={styles.separator} />
              {items.map(item => (
                <View key={item.id}>
                  <TouchableOpacity style={styles.cancelContainer} onPress={() => onSelect(item)}>
                    <Image style={styles.icon} source={item.icon} resizeMode="contain" />
                    <Text style={styles.actionText}>{item.label}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ModalPopup>
      )}
    </>
  );
};

ModalPicker.propTypes = {
  pickerTitle: PropTypes.string,
  items: PropTypes.array,
  cancelText: PropTypes.string,
  onChooseAction: PropTypes.func,
};

ModalPicker.defaultProps = {
  pickerTitle: '',
  items: [],
  cancelText: translate(STRINGS.CANCEL),
  onChooseAction: () => {},
};

export default ModalPicker;
