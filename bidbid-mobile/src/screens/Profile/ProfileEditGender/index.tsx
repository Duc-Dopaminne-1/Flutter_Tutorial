import React, { ReactElement, useEffect, useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getGenders, updateGender } from '@/redux/user/actions';
import { colors, fonts } from '@/vars';
import GenderButton from './components/GenderButton';
import { UserInit } from '@/redux/user/reducer';
import { useNavigation } from '@react-navigation/native';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import Spinner from '@/components/Spinner';
import { Gender } from '@/models/';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import CustomButton from '@/components/CustomButton';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import { sortArrayByOrder } from '@/shared/processing';

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: colors.white,
};

const BUTTON_SAVE: ViewStyle = {
  width: null,
};

const BUTTON_TITLE: TextStyle = {
  fontWeight: '400',
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s22,
};

const WRAPPER_AREA_GENDER_BUTTON: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  marginTop: 60,
};

const WRAPPER_SAVE_BUTTON: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 50,
  marginHorizontal: 15,
};

export function ProfileEditGenderScreen(): ReactElement {
  const dispatch = useDispatch();
  const userData = useSelector((state: UserInit) => state.user.data);
  const navigation = useNavigation();

  const [genderSelected, setGenderSelected] = useState(userData.gender);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const genderButtonOnPressed = (gender: Gender) => {
    setGenderSelected(gender);
  };

  useEnableHardwareBackButton();

  useEffect(() => {
    dispatch(
      getGenders({
        onSuccess: (data: Gender[]) => {
          setGenders(data);
          setIsLoading(false);
        },
        onFail: () => {
          setIsLoading(false);
          setGenders([]);
        },
      }),
    );
  }, []);

  const saveOnPressed = async () => {
    const genderIdOld = userData.genderId;
    if (genderIdOld === genderSelected.id) {
      navigation.goBack();
    } else {
      const result = await dispatch(updateGender(genderSelected.id as number));
      if (result) navigation.goBack();
    }
  };

  return (
    <View style={CONTAINER}>
      <SafeArea />
      <CustomWrapHeader titleStyle={TITLE} title={language('genderScreen.title')} />
      <View style={WRAPPER_AREA_GENDER_BUTTON}>
        {sortArrayByOrder(genders).map(gender => {
          return (
            <GenderButton key={gender.id.toString()} gender={gender} genderSelected={genderSelected} onPress={genderButtonOnPressed} />
          );
        })}
      </View>

      <View style={WRAPPER_SAVE_BUTTON}>
        <CustomButton onPress={saveOnPressed} containerStyle={BUTTON_SAVE} text={language('save')} textStyle={BUTTON_TITLE} />
      </View>

      <Spinner loading={isLoading} />
    </View>
  );
}
