import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts, images } from '@/vars';
import StarRating from 'react-native-star-rating';
import { capitalizeAllWorks } from '@/shared/processing';
import DefaultText from '@/components/CustomText/DefaultText';
import { formatNameUser } from '@/shared/discovery';

interface Props {
  reviewObject?: any;
  rating: number;
  ratingSelectedCallBack?: (rating: number) => void;
}

export default function ReviewRatting(props: Props): ReactElement {
  const { reviewObject, rating, ratingSelectedCallBack = () => {} } = props;
  const { user: reviewFor = {} } = reviewObject;
  const who = capitalizeAllWorks(formatNameUser(reviewFor) || 'Unknow');

  return (
    <View style={styles.container}>
      {/* Rate Description View */}
      <View style={styles.rateContentView}>
        <DefaultText {...{ style: styles.textDesc }}>{language('auctionReview.rateDesc', { who: who })}</DefaultText>
      </View>

      {/* Rate  View */}
      <View style={styles.rateWrapper}>
        <StarRating
          maxStars={5}
          rating={rating}
          containerStyle={styles.startStyle}
          emptyStar={images.icEmptyStar}
          fullStar={images.icFillStar}
          selectedStar={rating => ratingSelectedCallBack(rating)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  } as ViewStyle,

  startStyle: {
    justifyContent: 'space-evenly',
  } as any,

  rateWrapper: {
    marginVertical: 10,
    marginHorizontal: 20,
  } as ViewStyle,

  rateContentView: {
    padding: 2,
    marginVertical: 5,
  } as ViewStyle,

  textDesc: {
    textAlign: 'left',
    marginHorizontal: 10,
    fontSize: fonts.size.s15,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,
});
