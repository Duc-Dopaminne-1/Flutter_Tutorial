import PropTypes from 'prop-types';
import React, {forwardRef, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {medium, normal, small} from '../../assets/theme/metric';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import FilterFloorBottom from './FilterFloorBottom';

const NUMBER_COLUMNS = 4;
const ITEM_FLOOR_WIDTH = (SCREEN_SIZE.WIDTH - medium * 2 - normal) / NUMBER_COLUMNS;
const ITEM_FLOOR_HEIGHT = 100;

const styles = StyleSheet.create({
  itemTextFloor: {fontSize: 16},
  itemNumberFloor: {...FONTS.bold, fontSize: 25},
  itemFloor: {
    width: ITEM_FLOOR_WIDTH,
    height: ITEM_FLOOR_HEIGHT,
    borderRadius: 5,
    ...HELPERS.center,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.SEPARATOR_LINE,
    margin: 6,
  },
  titleStyle: {justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'},
  textSelectFloor: {...FONTS.bold, fontSize: 25},
  textLimitSelect: {
    marginBottom: small,
    marginTop: normal,
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_40,
    fontSize: 14,
    textAlign: 'justify',
  },
});

export const ModalSelectFloor = forwardRef(({floorData, onApplyFilter}, ref) => {
  const [arraySelect, setArraySelect] = useState(floorData.slice(0, 3));
  const scrollY = useRef(new Animated.Value(0)).current;
  const onPressItem = ({item}) => {
    const isInclude = arraySelect.includes(item);
    if (isInclude && arraySelect.length <= 3) {
      const temp = arraySelect.filter(f => f !== item);
      setArraySelect(temp);
    } else if (!isInclude && arraySelect.length >= 3) {
      return;
    } else {
      setArraySelect(array => [...array, item]);
    }
  };

  const onClearFilter = () => {
    setArraySelect([]);
  };

  const RenderItem = ({item, onPress}) => {
    const isCheck = arraySelect.includes(item);
    const textColor = {color: isCheck ? COLORS.NEUTRAL_WHITE : COLORS.TEXT_DARK_10};
    const backgroundItem = {backgroundColor: isCheck ? COLORS.PRIMARY_A100 : COLORS.NEUTRAL_WHITE};
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.itemFloor, backgroundItem]}>
        <Text style={[styles.itemTextFloor, textColor]}>{translate('floor')}</Text>
        <Text style={[styles.itemNumberFloor, textColor]}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modalize
      threshold={300}
      velocity={1000}
      disableScrollIfPossible={true}
      modalTopOffset={20}
      modalStyle={{backgroundColor: COLORS.BACKGROUND}}
      adjustToContentHeight={true}
      HeaderComponent={
        <View style={{padding: normal}}>
          <View style={styles.titleStyle}>
            <Text style={styles.textSelectFloor}>{translate('project.slot.titleModal')}</Text>
          </View>
          <Text style={styles.textLimitSelect}>{translate('project.slot.subTitleModalFloor')}</Text>
        </View>
      }
      FooterComponent={
        <FilterFloorBottom
          onPressCancelFilter={onClearFilter}
          onPressApply={() => {
            ref.current.close();
            onApplyFilter(arraySelect.sort());
          }}
        />
      }
      ref={ref}
      flatListProps={{
        data: floorData,
        renderItem: ({item}) => <RenderItem item={item} onPress={() => onPressItem({item})} />,
        keyExtractor: item => item + '',
        showsVerticalScrollIndicator: false,
        onScroll: Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
          useNativeDriver: true,
        }),
        numColumns: NUMBER_COLUMNS,
        contentContainerStyle: {paddingHorizontal: 16},
        scrollEventThrottle: 16,
      }}
    />
  );
});

ModalSelectFloor.defaultProps = {
  floorData: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  onApplyFilter: () => {},
};

ModalSelectFloor.propTypes = {
  floorData: PropTypes.array,
  onApplyFilter: PropTypes.func,
};
