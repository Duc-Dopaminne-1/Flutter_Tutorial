import React, { useState, useEffect } from 'react';
import { View, TextStyle, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { useDispatch } from 'react-redux';
import { updateAboutMe } from '@/redux/user/actions';
import { UserInit } from '@/redux/user/reducer';
import { useSelector } from 'react-redux';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';
import { TextInputComponent } from '@/components/TextInput';

const MAX_LENGTH = 100;

const CONTAINER: ViewStyle = {
  marginVertical: 10,
};

const TOP_VIEW: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s16,
  color: colors.gray_900,
};

const NUMBER_LENGTH_TEXT: TextStyle = {
  fontSize: fonts.size.s12,
  color: colors.gray_500,
};

const TEXT_INPUT: TextStyle = {
  flex: 1,
  fontSize: fonts.size.s14,
  color: colors.gray_800,
};

const TEXT_INPUT_CONTAINER: ViewStyle = {
  borderBottomWidth: 0,
};

function AboutMeView() {
  const dispatch = useDispatch();
  const { description } = useSelector((state: UserInit) => {
    return state.user.data;
  });
  const [textInputValue, setTextInputValue] = useState(description);

  useEffect(() => {
    setTextInputValue(description);
  }, [description]);
  const onChangeText = (text: string) => {
    setTextInputValue(text);
  };

  const onBlur = () => {
    dispatch(updateAboutMe(textInputValue));
  };

  return (
    <View style={CONTAINER}>
      <View style={TOP_VIEW}>
        <DefaultText {...{ style: TITLE }}>{language('profileGeneral.aboutMe')}</DefaultText>
        <DefaultText {...{ style: NUMBER_LENGTH_TEXT }}>
          {textInputValue ? textInputValue.length : 0}
          {'/'}
          {MAX_LENGTH}
        </DefaultText>
      </View>
      <TextInputComponent
        styleFormConfig={TEXT_INPUT_CONTAINER}
        onChangeText={onChangeText}
        value={textInputValue}
        placeholder={language('profileGeneral.addAboutMe')}
        multiline
        maxLength={MAX_LENGTH}
        textAlignVertical={'top'}
        onBlur={onBlur}
        styleConfig={TEXT_INPUT}
      />
    </View>
  );
}

export default React.memo(AboutMeView);
