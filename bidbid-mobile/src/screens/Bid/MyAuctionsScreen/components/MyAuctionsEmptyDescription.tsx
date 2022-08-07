import React, { ReactElement } from 'react';
import { StyleSheet, View, ViewStyle, Text, TextStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { useSelector } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';
import ThumbUpSVG from '@/components/SVG/ThumbUpSVG';
import IconMyAuctionEmptySVG from '@/components/SVG/IconMyAuctionEmptySVG';

interface MyAuctionsEmptyDescriptionProps {
  shouldHideImageEmpty?: boolean;
}
export default function MyAuctionsEmptyDescription(props: MyAuctionsEmptyDescriptionProps): ReactElement {
  const { shouldHideImageEmpty } = props;
  const likeUser = useSelector((state: UserInit) => state.user.data.likes);
  return (
    <View style={styles.container}>
      {!shouldHideImageEmpty && (
        <View style={styles.iconMyAuctionEmptyWrapper}>
          <IconMyAuctionEmptySVG />
        </View>
      )}

      <View style={styles.rowDescriptionView}>
        <View style={styles.iconRedHeartWrapper}>
          <ThumbUpSVG />
        </View>

        <Text style={styles.textLike}>
          {language(likeUser && likeUser === 1 ? 'personWouldLikeYou' : 'peopleWouldLikeYou', { like: likeUser })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginHorizontal: 30,
  },

  iconMyAuctionEmptyWrapper: {
    alignItems: 'center',
    marginVertical: 30,
  } as ViewStyle,

  iconRedHeartWrapper: {
    alignItems: 'center',
    padding: 4,
  } as ViewStyle,

  rowDescriptionView: {
    flexDirection: 'row',
  } as ViewStyle,

  textLike: {
    flex: 1,
    marginLeft: 5,
    color: colors.gray_900,
    fontSize: fonts.size.s15,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,
});
