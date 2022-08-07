import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';

import {CONSTANTS} from '../../../../assets/constants';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {METRICS, normal} from '../../../../assets/theme/metric';
import SearchBox from '../../SearchBox';
import {useHeaderAnimation} from './useHeaderAnimation';

const HEADER_MAX_HEIGHT = 170;
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedImage = Animated.createAnimatedComponent(Image);

const ImageButton = ({image, style, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      hitSlop={CONSTANTS.HIT_SLOP}
      onPress={onPress}
      style={[styles.btnImageButton, style]}>
      <Image source={image} style={styles.imageButton} />
    </TouchableOpacity>
  );
};

const HeaderAnimation = ({onSearch, animatedValue, onKeywordChange, keyword, setKeyword}) => {
  const {viewStyle, headerScale} = useHeaderAnimation({animatedValue});
  return (
    <>
      <Animated.View style={[viewStyle, styles.viewImage]}>
        <AnimatedImage source={IMAGES.IMG_BANNER_HOME} resizeMode={'cover'} style={styles.header} />
        <View style={styles.searchView}>
          <SearchBox
            onSearch={onSearch}
            visibleRight={false}
            style={styles.searchBox}
            onKeywordChange={onKeywordChange}
            keyword={keyword}
            setKeyword={setKeyword}
            searchPlaceHolder={translate(STRINGS.SEARCH_PROPERTY_PLACEHOLDER)}
          />
        </View>
      </Animated.View>
      <Animated.View style={[styles.headerImage, headerScale]}>
        <View style={styles.headerView}>
          <Image resizeMode="contain" source={IMAGES.IMG_LOGO_TOPENLAND} />
          <ImageButton image={IMAGES.IC_SEARCH} onPress={onSearch} />
        </View>
        <AnimatedGradient
          colors={[COLORS.BLACK_OPACITY_01, COLORS.TRANSPARENT]}
          style={styles.gradientView}
        />
      </Animated.View>
    </>
  );
};

export default HeaderAnimation;

const styles = StyleSheet.create({
  searchBox: {...METRICS.resetMargin, flex: 1},
  viewImage: {
    left: 0,
    right: 0,
    position: 'absolute',
    top: 0,
    height: HEADER_MAX_HEIGHT,
    zIndex: 1,
  },
  headerImage: {
    height: 50,
    width: '100%',
    position: 'absolute',
    zIndex: 2,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    justifyContent: 'center',
  },
  gradientView: {
    top: 10,
    width: '100%',
    height: 5,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: normal,
  },
  header: {height: HEADER_MAX_HEIGHT, width: '100%', justifyContent: 'flex-end'},
  searchView: {marginHorizontal: normal, top: -20, flexDirection: 'row', alignItems: 'center'},
  imageButton: {tintColor: COLORS.PRIMARY_A100},
  btnImageButton: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
