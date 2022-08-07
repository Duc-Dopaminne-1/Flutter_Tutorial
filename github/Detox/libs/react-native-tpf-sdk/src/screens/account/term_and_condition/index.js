import { getTermAndConditionListHandle } from '../../../redux/actions/termAndCodition';
import CustomWebview from '../../../components/custom_webview';
import { FONT_FAMILY, FONT_SIZE } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import SafeAreaView from 'react-native-safe-area-view';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';

const TermAndCondition = props => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.termAndCondition.termAndConditionList);

  useEffect(() => {
    dispatch(getTermAndConditionListHandle({ includeContent: true }));
  }, [dispatch]);
  const item = items.length > 0 ? items[0] : {};
  const content = item.content || '';

  return (
    <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <FastImage
            source={{ uri: item.imageLink || '' }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <CustomWebview {...{ content }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermAndCondition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  image: {
    width: '100%',
    height: scale(32)
  },
  imageContainer: {
    paddingHorizontal: SPACING.Medium,
    paddingTop: scale(48),
    paddingBottom: scale(32)
  },
  wrapper: {
    paddingHorizontal: SPACING.Medium,
    paddingBottom: SPACING.HtmlBottom
  },
  titleContainer: {
    alignItems: 'center'
  },
  title: {
    color: TEXT_COLOR.Primary,
    fontSize: FONT_SIZE.Heading
  },
  bodyContainer: {
    paddingVertical: SPACING.Medium
  },
  content: {
    color: CUSTOM_COLOR.Black,
    fontSize: FONT_SIZE.BodyText,
    textAlign: 'justify'
  }
});
