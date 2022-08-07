import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View, TextInput, Keyboard } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/reducers';
import { capitalizeAllWorks } from '@/shared/processing';
import DefaultText from '@/components/CustomText/DefaultText';
import { formatNameUser } from '@/shared/discovery';

// flag value
// -1:  Un-Selected
// 0:  NO
// 1:  YES

interface Props {
  reviewObject?: any;
  noteText?: string;
  textInputCallback?: (text: string) => void;
}

export default function ReviewAnyMoreThought(props: Props): ReactElement {
  const { reviewObject, noteText = '', textInputCallback = () => {} } = props;
  const { user: reviewFor = {} } = reviewObject;
  const who = capitalizeAllWorks(formatNameUser(reviewFor) || 'Unknow');

  return (
    <View style={styles.container}>
      <View style={styles.anyMoreView}>
        <DefaultText {...{ style: styles.textDesc }}>{language('auctionReview.anyMoreThoughts', { who: who })}</DefaultText>
        <TextInput
          style={styles.textInput}
          onChangeText={text => textInputCallback(text)}
          placeholder={language('auctionReview.typeHere')}
          multiline={true}
          value={noteText}
          returnKeyType={'done'}
          onFocus={() => {
            // setShowErrorMesssage(false);
          }}
          onSubmitEditing={() => Keyboard.dismiss()}
          placeholderTextColor={colors.text_light_gray}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  } as ViewStyle,

  textDesc: {
    textAlign: 'left',
    marginHorizontal: 10,
    fontSize: fonts.size.s15,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  anyMoreView: {
    padding: 2,
    marginVertical: 5,
  } as ViewStyle,

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
});
