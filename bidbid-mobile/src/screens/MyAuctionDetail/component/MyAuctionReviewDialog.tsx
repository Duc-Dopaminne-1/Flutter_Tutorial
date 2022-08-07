import React, { ReactElement, useState } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View, Text, Pressable, TextInput } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts, images } from '@/vars';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating';
import RadioUnCheckSVG from '@/components/SVG/RadioUnCheckSVG';
import RadioCheckedSVG from '@/components/SVG/RadioCheckedSVG';

interface Props {
  isVisible: boolean;
  onBackdropPress?: () => void;
  submitOnPressedCallback?: () => void;
}
export default function MyAuctionReviewDialog(props: Props): ReactElement {
  const { isVisible, onBackdropPress = () => {}, submitOnPressedCallback = () => {} } = props;

  const [rating, setRatting] = useState(0);
  const [continueAllowingMessage, setContinueAllowingMessage] = useState(-1);
  const [thinkText, setThinkText] = useState('');

  const submitOnPressed = () => {
    onBackdropPress();
    submitOnPressedCallback && submitOnPressedCallback();
  };

  const who = 'ABCDE';

  return (
    <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={isVisible} style={styles.wrapModal}>
      <View style={styles.container}>
        {/* Title Content View */}
        <View style={styles.titleContentView}>
          <Text style={styles.description}>{language('auctionReview.title', { who: 'Biddee' })}</Text>
        </View>

        {/* Rate Description View */}
        <View style={styles.rateContentView}>
          <Text style={styles.textDesc}>{language('auctionReview.rateDesc', { who: who })}</Text>
        </View>

        {/* Rate  View */}
        <View style={styles.rateWrapper}>
          <StarRating
            maxStars={5}
            rating={rating}
            containerStyle={styles.startStyle}
            emptyStar={images.icEmptyStar}
            fullStar={images.icFillStar}
            selectedStar={rating => setRatting(rating)}
          />
        </View>

        {/* Continue Allowing Message  View */}
        <View style={styles.continueAllowingMessageView}>
          <Text style={styles.textDesc}>{language('auctionReview.continueAllowingMessage', { who: who })}</Text>
        </View>

        {/* Raido Check View */}
        <View style={styles.radioCheckView}>
          <View style={styles.radioRowView}>
            <Pressable
              style={styles.radioWrapper}
              onPress={() => {
                setContinueAllowingMessage(1);
              }}
            >
              {continueAllowingMessage === 1 ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}
            </Pressable>
            <Text style={styles.yesText}>{language('yes')}</Text>
          </View>
          <View style={styles.spaceView}></View>
          <View style={styles.radioRowView}>
            <Pressable
              style={styles.radioWrapper}
              onPress={() => {
                setContinueAllowingMessage(0);
              }}
            >
              {continueAllowingMessage === 0 ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}
            </Pressable>
            <Text style={styles.noText}>{language('no')}</Text>
          </View>
        </View>

        {/* Any more thougts View */}
        <View style={styles.anyMoreView}>
          <Text style={styles.textDesc}>{language('auctionReview.anyMoreThoughts')}</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => {
              setThinkText(text);
            }}
            placeholder={language('auctionReview.typeHere')}
            multiline={true}
            value={thinkText}
            placeholderTextColor={colors.text_light_gray}
          />
        </View>

        {/* Submit View */}
        <View style={styles.submitView}>
          <Pressable style={styles.pauseMyAccountButtonView} onPress={submitOnPressed}>
            <Text style={styles.submitText}>{language('moveAndScaleScreen.submit')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapModal: {
    margin: 0,
    justifyContent: 'center',
  } as ViewStyle,

  container: {
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

  startStyle: {
    justifyContent: 'space-evenly',
  } as any,

  rateWrapper: {
    marginVertical: 10,
    marginHorizontal: 20,
  } as ViewStyle,

  radioRowView: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  titleContentView: {
    padding: 2,
    marginVertical: 5,
  } as ViewStyle,

  rateContentView: {
    padding: 2,
    marginVertical: 5,
  } as ViewStyle,

  continueAllowingMessageView: {
    padding: 2,
    marginVertical: 5,
    justifyContent: 'flex-start',
  } as ViewStyle,

  radioCheckView: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  radioWrapper: {
    padding: 10,
    alignItems: 'center',
  } as ViewStyle,

  anyMoreView: {
    padding: 2,
    marginVertical: 5,
  } as ViewStyle,

  submitView: {
    padding: 2,
    marginVertical: 20,
    alignItems: 'center',
  } as ViewStyle,

  spaceView: {
    width: 30,
  } as ViewStyle,

  description: {
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,

  textDesc: {
    textAlign: 'left',
    marginHorizontal: 10,
    fontSize: fonts.size.s15,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  yesText: {
    fontSize: fonts.size.s15,
    color: colors.gray_600,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  noText: {
    fontSize: fonts.size.s15,
    color: colors.gray_600,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  textInput: {
    marginHorizontal: 10,
    marginTop: 20,
    minHeight: 120,
    paddingTop: 15,
    padding: 12,
    borderRadius: 10,
    textAlign: 'justify',
    textAlignVertical: 'top',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.blue_700_alpha_07,
  } as TextStyle,

  pauseMyAccountButtonView: {
    width: '85%',
    height: 50,
    borderRadius: 36,
    backgroundColor: colors.red_700,
    justifyContent: 'center',
  } as ViewStyle,

  submitText: {
    textAlign: 'center',
    fontSize: fonts.size.s17,
    color: colors.white,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,
});
