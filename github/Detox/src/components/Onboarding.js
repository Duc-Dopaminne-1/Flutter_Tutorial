import React, {useRef} from 'react';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import {IMAGES} from '../assets/images';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {normal, small} from '../assets/theme/metric';
import useMergeState from '../hooks/useMergeState';
import CustomButton from './Button/CustomButton';
import {Pagination} from './Pagination';
import SafeAreaScreenContainer from './SafeAreaScreenContainer';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {backgroundColor: COLORS.NEUTRAL_WHITE},
  title: {
    ...FONTS.semiBold,
    fontSize: 20,
    color: COLORS.TEXT_DARK_10,
  },
  description: {
    ...FONTS.regular,
    fontSize: 14,
    marginTop: small,
    color: COLORS.TEXT_DARK_10,
    textAlign: 'center',
    marginHorizontal: normal,
  },
  skip: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.PRIMARY_A100,
  },
  bottom: {
    justifyContent: 'space-between',
    paddingHorizontal: normal,
    marginBottom: normal,
    width: '100%',
  },

  next: {
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: 6,
    marginBottom: 20,
    height: 50,
  },
  nextTitle: {
    ...FONTS.semiBold,
    fontSize: 18,
  },
  itemContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  image: {width: '100%', height: height / 2},
  backgroundImage: {
    backgroundColor: COLORS.PINK_F5,
    height: height / 2,
    position: 'absolute',
    borderRadius: 18,
    left: 16,
    right: 16,
    top: 20,
    zIndex: -1,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 57,
  },
  emptyBottom: {height: 20},
  paginationContainer: {
    position: 'absolute',
    top: height / 2 + 36,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

const intro = [
  {
    image: IMAGES.ONBOARDING_1,
    title: translate('onBoarding.title.one'),
    description: translate('onBoarding.description.one'),
  },
  {
    image: IMAGES.ONBOARDING_2,
    title: translate('onBoarding.title.two'),
    description: translate('onBoarding.description.two'),
  },
  {
    image: IMAGES.ONBOARDING_3,
    title: translate('onBoarding.title.three'),
    description: translate('onBoarding.description.three'),
  },
];

const Onboarding = ({gotoNext}) => {
  const carouselRef = useRef(null);
  const [state, setState] = useMergeState({
    activeSlide: 0,
    needShowSkip: true,
  });

  const onSnapToItem = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setState({
      activeSlide: index,
      needShowSkip: index !== intro.length - 1,
    });
  };

  const renderItem = ({item}) => {
    const {image, title, description} = item;
    return (
      <View style={styles.itemContainer}>
        <Image source={image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    );
  };

  const renderCarousel = () => {
    return (
      <Carousel
        ref={carouselRef}
        data={intro}
        renderItem={renderItem}
        width={width}
        loop={false}
        height="100%"
        onSnapToItem={onSnapToItem}
      />
    );
  };

  const onPressNextButton = () => {
    if (state.needShowSkip) {
      carouselRef.current?.next();
      return;
    }
    gotoNext();
  };

  const renderFooter = () => {
    return (
      <View style={styles.bottom}>
        <CustomButton
          title={translate(state.needShowSkip ? STRINGS.NEXT : STRINGS.START)}
          style={styles.next}
          titleStyle={styles.nextTitle}
          onPress={onPressNextButton}
        />
        {state.needShowSkip ? (
          <TouchableOpacity style={HELPERS.selfCenter} onPress={gotoNext}>
            <Text style={styles.skip}>{translate(STRINGS.SKIP)}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyBottom} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaScreenContainer style={styles.container}>
      <View style={HELPERS.fill}>
        <View style={styles.backgroundImage} />
        {renderCarousel()}
        <Pagination
          dotsLength={intro.length}
          activeDotIndex={state.activeSlide}
          style={styles.paginationContainer}
        />
      </View>
      {renderFooter()}
    </SafeAreaScreenContainer>
  );
};

export default Onboarding;
