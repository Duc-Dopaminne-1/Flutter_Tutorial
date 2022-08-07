import { getListResponsesHandle } from '../../../../redux/actions/credit';
import { empty_info } from '../../../../assets/images';
import { EmptyContent } from '../../../../components/';
import AppText from '../../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import { Shadow } from '../../../../constants/stylesCSS';
import { formatDate } from '../../../../helpers/formatTime';
import React, { useContext, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../../utils/responsive';
import themeContext from '../../../../constants/theme/themeContext';

const FeedbackTab = props => {
  const { itemDetail } = props;
  const feedbackList = useSelector(state => state.credit.feedbackList);

  const dispatch = useDispatch();
  const { fonts } = useContext(themeContext) || {};
  useEffect(() => {
    dispatch(getListResponsesHandle({ orderId: itemDetail?.id }));
  }, [dispatch, itemDetail]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.resContainer}>
        <View style={styles.dotContainer}>
          <AppText translate style={styles.textTitle}>
            feedback.response_date
          </AppText>
          <Text style={[styles.textDate, { fontFamily: fonts?.MEDIUM }]}>
            {item?.creationTime ? formatDate(item?.creationTime) : ''}
          </Text>
          <AppText translate style={styles.textTitle}>
            feedback.content
          </AppText>
          <Text style={[styles.textDate, { fontFamily: fonts?.MEDIUM }]}>{item?.reason}</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={feedbackList}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<EmptyContent translate title={'feedback.message'} image={empty_info} />}
    />
  );
};

export default FeedbackTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  wrapper: {
    paddingBottom: SPACING.HasBottomButton,
    paddingTop: SPACING.XMedium,
    paddingHorizontal: SPACING.Medium
  },
  resContainer: {
    backgroundColor: CUSTOM_COLOR.White,
    marginHorizontal: scale(16),
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    marginBottom: scale(16),
    ...Shadow
  },
  textTitle: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.GreenBold,
    marginBottom: scale(4)
  },
  textDate: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.GreenBold,
    marginBottom: scale(12)
  }
});
