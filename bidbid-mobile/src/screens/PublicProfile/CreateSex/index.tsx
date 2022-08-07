import React, { useState, useEffect, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { getGenders } from '@/redux/user/actions';
import { SafeArea } from '@/components/SafeArea';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import { useNavigation } from '@react-navigation/native';
import { CREATE_PHOTO_SCREEN } from '@/navigation/screenKeys';
import { useAlertMessage } from '@/constants/messageConstants';
import CustomButton from '@/components/CustomButton';
import { saveProfile } from '@/redux/createProfile/actions';
import { useDispatch } from 'react-redux';
import { Gender } from '@/models/';
import GenderButton from '../../Profile/ProfileEditGender/components/GenderButton';
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';
import { sortArrayByOrder } from '@/shared/processing';

export function CreateSexScreen(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const alertMessage = useAlertMessage();

  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [genderSelected, setGenderSelected] = useState<Gender>(null);

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

  const genderButtonOnPressed = (gender: Gender) => {
    setGenderSelected(gender);
    setShowError(false);
  };

  const handleSubmit = () => {
    if (!genderSelected && !showError) {
      setShowError(true);
    } else if (genderSelected) {
      dispatch(
        saveProfile({
          genderId: genderSelected.id as string,
        }),
      );
      navigation.navigate(CREATE_PHOTO_SCREEN);
    }
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomWrapHeader title={language('iam')} titleStyle={styles.txtTitle} />

      <View style={styles.wrapper_area_gender_button}>
        {sortArrayByOrder(genders).map(gender => {
          return (
            <GenderButton key={gender.id.toString()} gender={gender} genderSelected={genderSelected} onPress={genderButtonOnPressed} />
          );
        })}
      </View>
      {showError && (
        <View style={styles.wrapErrorView}>
          <ErrorMessage errorValue={alertMessage.EMPTY_CHOOSE} />
        </View>
      )}
      <View style={styles.wrapBtn}>
        <CustomButton onPress={handleSubmit} containerStyle={styles.btnContinue} text={language('continue')} />
      </View>
      <Spinner loading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  wrapper_area_gender_button: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  wrapErrorView: {
    marginTop: 10,
    paddingHorizontal: 20,
  },

  wrapBtn: {
    marginTop: 30,
    paddingHorizontal: 60,
  },
  btnContinue: {
    paddingVertical: 13,
    marginTop: 24,
    alignSelf: 'center',
  },
  txtTitle: {
    fontSize: fonts.size.s22,
  },
});
