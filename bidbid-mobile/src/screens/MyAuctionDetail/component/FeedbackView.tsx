import React, { ReactElement } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, images } from '@/vars';
import { language } from '@/i18n';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import StarRating from 'react-native-star-rating';

export function FeedbackView(): ReactElement {
  const user = useSelector((state: RootState) => {
    return state.user.data;
  });
  const auction = useSelector((state: RootState) => {
    return state.auction.auctionDetail;
  });

  const reviews = auction.reviews || [];
  if (!reviews || reviews.length < 1) return null;

  let start = 5;
  reviews.map(item => {
    if (item.reviewerId === user.id) {
      start = item.score;
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{language('auctionReview.thanksFeedback')}</Text>
      <View style={styles.rateWrapper}>
        <StarRating
          maxStars={5}
          rating={start}
          containerStyle={styles.startStyle}
          starSize={30}
          emptyStar={images.icEmptyStar}
          fullStar={images.icFillStar}
          disabled={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.white,
    elevation: 12,
    shadowColor: colors.gray_shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 8,
    shadowRadius: 8,
  },

  rateWrapper: {
    marginVertical: 10,
    marginHorizontal: 15,
  } as ViewStyle,

  text: {
    textAlign: 'center',
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  },

  startStyle: {
    justifyContent: 'space-evenly',
  } as any,
});
