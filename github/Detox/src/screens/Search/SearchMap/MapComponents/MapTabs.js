import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ViewPropTypes} from 'react-native';

import {POST_TYPE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {normal, small} from '../../../../assets/theme/metric';

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
  },
  viewLeft: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flex: 1,
  },
  viewRight: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    flex: 1,
  },
  viewActive: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
  viewInActive: {
    backgroundColor: COLORS.GREY_82,
  },
  titleButton: {
    ...FONTS.regular,
    fontSize: 15,
    textAlign: 'center',
    marginVertical: small,
    marginHorizontal: normal,
  },
  titleActive: {
    color: COLORS.NEUTRAL_WHITE,
  },
  titleInActive: {
    color: COLORS.GRAY_BD,
  },
});

const RenderTab = ({item, index, onPressTab, selectedType}) => {
  const viewStyle = index === 0 ? styles.viewLeft : styles.viewRight;
  const viewStateStyle = item.type === selectedType ? styles.viewActive : styles.viewInActive;
  const titleStateStyle = item.type === selectedType ? styles.titleActive : styles.titleInActive;
  return (
    <TouchableOpacity style={[viewStyle, viewStateStyle]} onPress={() => onPressTab(item.type)}>
      <Text style={[styles.titleButton, titleStateStyle]}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const MapTabs = ({style, selectedType, onPressType}) => {
  const routes = [
    {type: POST_TYPE.B2C, title: translate(STRINGS.PROJECT)},
    {type: POST_TYPE.C2C, title: translate(STRINGS.RETAIL_ESTATES)},
  ];

  const onPressTab = type => {
    onPressType(type);
  };

  return (
    <View style={[styles.viewContainer, style]}>
      {routes.map((item, index) => (
        <RenderTab
          key={index.toString()}
          item={item}
          index={index}
          onPressTab={onPressTab}
          selectedType={selectedType}
        />
      ))}
    </View>
  );
};

MapTabs.propTypes = {
  style: ViewPropTypes.style,
  selectedType: PropTypes.string,
  onPressType: PropTypes.func,
};

MapTabs.defaultProps = {
  selectedType: 0,
  onPressType: () => {},
};

export default MapTabs;
