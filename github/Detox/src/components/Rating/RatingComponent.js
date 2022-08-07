import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import StarRating from 'react-native-star-rating';

import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {commonStyles} from '../../assets/theme/styles';
import {processRatingNumber} from '../../utils/DataProcessUtil';

const TOTAL_RATINGS = 5;
const RATING_IMAGE_SIZE = 20;

const RatingNumberView = ({rateNumber, reverse = false}) => {
  return (
    <View style={[styles.numberViewContainer, reverse && HELPERS.rowReverse]}>
      <Image source={IMAGES.IC_STAR_RATED} style={styles.starIcon} resizeMode="contain" />
      <View style={commonStyles.separatorColumn4} />
      <Text style={styles.numberText}>{rateNumber?.toFixed(1) || '0.0'}</Text>
    </View>
  );
};

const RatingComponent = ({
  rateNumber = 0,
  imageSize = RATING_IMAGE_SIZE,
  onFinishRating = () => {},
  readonly = true,
  isProcess = true,
  showRatingText = false,
  isFullView = true,
  isReverse = false,
}) => {
  const ratingValue = isProcess ? processRatingNumber(rateNumber) : rateNumber;

  const handleFinishRating = ratedValue => {
    onFinishRating && onFinishRating(ratedValue);
  };

  if (!isFullView) {
    return <RatingNumberView rateNumber={rateNumber} reverse={isReverse} />;
  }

  return (
    <View style={HELPERS.rowCenter}>
      {showRatingText ? (
        <Text style={styles.ratingText}>{`${rateNumber ?? 0}/${TOTAL_RATINGS}`}</Text>
      ) : null}
      <StarRating
        emptyStar={'star'}
        fullStar={'star'}
        starSize={imageSize}
        halfStar={'star-half-empty'}
        iconSet={'FontAwesome'}
        maxStars={5}
        disabled={readonly}
        rating={ratingValue}
        selectedStar={handleFinishRating}
        fullStarColor={COLORS.GOLD}
        emptyStarColor={COLORS.TEXT_DARK_40}
        starStyle={styles.starStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ratingText: {...FONTS.regular, fontSize: SIZES.FONT_12, marginRight: 5},
  starStyle: {marginHorizontal: 4},
  numberViewContainer: {
    ...HELPERS.rowCenter,
  },
  starIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.PRIMARY_B100,
  },
  numberText: {
    top: 1,
    ...FONTS.bold,
    fontSize: SIZES.FONT_14,
    color: COLORS.PRIMARY_B100,
  },
});

RatingComponent.propTypes = {
  rateNumber: PropTypes.number,
};

export default RatingComponent;
