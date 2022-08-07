import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AddImageView from './AddImageView';
import PreviewProfileButton from './PreviewProfileButton';
import AboutMeView from './AboutMeView';
import CellDetail from './CellDetail';
import { useNavigation } from '@react-navigation/native';
import { UserInit } from '@/redux/user/reducer';
import { GENDER_TYPE } from '@/models/gender';
import { SeparatorView } from '@/components';
import ProfileHideAge from './ProfileHideAge';
import { updateHideAge } from '@/redux/user/actions';

import { useDispatch, useSelector } from 'react-redux';
import { language } from '@/i18n';

import {
  PROFILE_EDIT_GENDER,
  PROFILE_EDIT_INTERESTS,
  PROFILE_EDIT_SEXUAL_ORIENTATION,
  PROFILE_EDIT_CITY,
  PROFILE_EDIT_SCHOOL,
  PROFILE_EDIT_LANGUAGE,
  PROFILE_EDIT_INSTAGRAM_USERNAME,
  PROFILE_EDIT_JOB,
  PROFILE_EDIT_COMPANY,
  PROFILE_EDIT_CAREER_STRENGTHS_SCREEN,
  PROFILE_EDIT_CATEGORY_SCREEN,
  PROFILE_EDIT_MY_NAME,
} from '@/navigation/screenKeys';
import { RootState } from '@/redux/reducers';
import { colors } from '@/vars';
import { useLocalizeNameField } from '@/shared/processing';
import sortCategories from '@/shared/sortCategories';

export enum CELL_ENUM {
  I_AM,
  SEXUAL_ORIENTATION,
  CATEGORIES,
  CAREER_STRENGTHS,
  INTERESTS,
  COMPANY,
  JOB_TITLE,
  SCHOOL,
  LIVING_IN,
  LANGUAGE,
  INSTAGRAM_USERNAME,
  MY_NAME,
}

function BodyView() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    photos,
    avatarId,
    genderId,
    sexualOrientations = [],
    strengths = [],
    school,
    languages,
    interests,
    job,
    company,
    city,
    hideAge,
    categories,
    instagramUsername,
    firstName,
    lastName,
  } = useSelector((state: UserInit) => {
    return state.user.data;
  });
  useSelector((state: RootState) => state.app.locale);
  const gendersList = useSelector((state: RootState) => state.filters.data?.gendersList);
  const [shouldHideAge, setShouldHideAge] = useState(false);
  const localizeNameField = useLocalizeNameField();

  useEffect(() => {
    setShouldHideAge(hideAge);
  }, [hideAge]);

  const sexualOrientationsStringArray = sexualOrientations.map(item => localizeNameField(item));
  const sexualOrientationsString =
    sexualOrientationsStringArray && sexualOrientationsStringArray.length > 0
      ? sexualOrientationsStringArray.join(', ') + ' '
      : language('profileGeneral.addSexualOrientation');

  const careerStrengthsStringArray = strengths.map(item => localizeNameField(item));
  const careerStrengthsString =
    careerStrengthsStringArray && careerStrengthsStringArray.length > 0
      ? careerStrengthsStringArray.join(', ') + ' '
      : language('profileGeneral.addCareerStrengths');

  const categoriesStringArray = sortCategories(categories).map(item => localizeNameField(item));
  const categoriesString =
    categoriesStringArray && categoriesStringArray.length > 0
      ? categoriesStringArray.join(', ') + ' '
      : language('profileGeneral.addCategories');

  const schoolName = school ? school.name : language('profileGeneral.addSchool');

  const jobName = job ? job.name : language('profileGeneral.addJobTitle');
  const companyName = company ? company.name : language('profileGeneral.addCompany');

  const languagesStringArray = languages.map(item => localizeNameField(item));
  const languagesString = languagesStringArray.length > 0 ? languagesStringArray.join(', ') + ' ' : language('profileGeneral.addLanguages');

  const instagramUsernameString = instagramUsername || language('profileGeneral.addInstagramUsername');

  const myNameString = `${firstName} ${lastName || ''}` || language('profileGeneral.addMyName');

  const interestsStringArray = interests.map(item => localizeNameField(item));
  const interestsString = interestsStringArray.length > 0 ? interestsStringArray.join(', ') + ' ' : language('profileGeneral.addInterests');

  const hideAgeButton = async val => {
    setShouldHideAge(!shouldHideAge);
    await dispatch(updateHideAge(val));
  };

  const photosFiltered = photos.reduce((photoFiltered, photo) => {
    if (photo.id !== avatarId && photo.type !== 'verify' && photo.type !== 'thumbnail') photoFiltered.push(photo);
    return photoFiltered;
  }, []);

  const cityDescription = city ? city?.address : language('profileGeneral.addCity');

  const cellOnPressed = (type: CELL_ENUM) => {
    switch (type) {
      case CELL_ENUM.I_AM:
        navigation.navigate(PROFILE_EDIT_GENDER);
        break;
      case CELL_ENUM.SEXUAL_ORIENTATION:
        navigation.navigate(PROFILE_EDIT_SEXUAL_ORIENTATION);
        break;
      case CELL_ENUM.CATEGORIES:
        navigation.navigate(PROFILE_EDIT_CATEGORY_SCREEN);
        break;
      case CELL_ENUM.CAREER_STRENGTHS:
        navigation.navigate(PROFILE_EDIT_CAREER_STRENGTHS_SCREEN);
        break;
      case CELL_ENUM.INTERESTS:
        navigation.navigate(PROFILE_EDIT_INTERESTS);
        break;
      case CELL_ENUM.COMPANY:
        navigation.navigate(PROFILE_EDIT_COMPANY);
        break;
      case CELL_ENUM.JOB_TITLE:
        navigation.navigate(PROFILE_EDIT_JOB);
        break;
      case CELL_ENUM.SCHOOL:
        navigation.navigate(PROFILE_EDIT_SCHOOL);
        break;
      case CELL_ENUM.LIVING_IN:
        navigation.navigate(PROFILE_EDIT_CITY);
        break;
      case CELL_ENUM.LANGUAGE:
        navigation.navigate(PROFILE_EDIT_LANGUAGE);
        break;
      case CELL_ENUM.INSTAGRAM_USERNAME:
        navigation.navigate(PROFILE_EDIT_INSTAGRAM_USERNAME);
        break;
      case CELL_ENUM.MY_NAME:
        navigation.navigate(PROFILE_EDIT_MY_NAME);
        break;

      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapperAddImageView}>
        <AddImageView photo={photosFiltered[0]} />
        <AddImageView photo={photosFiltered[1]} />
      </View>

      {/* Preview Profile Button */}
      <View style={styles.wrapperPreviewProfileButton}>
        <ProfileHideAge
          title={language('showAge')}
          isEnabled={!shouldHideAge}
          disabled={false}
          toggleSwitchCallBack={async (flag: boolean) => hideAgeButton(!flag)}
        />
        <PreviewProfileButton />
      </View>

      <View style={styles.wrapperDetailInfo}>
        <CellDetail
          title={language('myFirstName')}
          description={myNameString}
          type={CELL_ENUM.MY_NAME}
          onPress={cellOnPressed}
          isTextTransform={true}
        />
        <SeparatorView />

        <CellDetail
          title={language('profileGeneral.igUsername')}
          description={instagramUsernameString}
          type={CELL_ENUM.INSTAGRAM_USERNAME}
          onPress={cellOnPressed}
          isTextTransform={false}
        />
        <SeparatorView />
        <AboutMeView />
        <SeparatorView />
        <CellDetail
          title={language('profileGeneral.gender')}
          description={localizeNameField(gendersList.find(item => item.id === genderId)) || GENDER_TYPE[genderId]}
          type={CELL_ENUM.I_AM}
          onPress={cellOnPressed}
        />
        <SeparatorView />
        <CellDetail
          title={language('profileGeneral.sexualOrientationLowerCase')}
          description={sexualOrientationsString}
          type={CELL_ENUM.SEXUAL_ORIENTATION}
          onPress={cellOnPressed}
        />
        <SeparatorView />
        <CellDetail
          title={language('profileGeneral.categories')}
          description={categoriesString}
          type={CELL_ENUM.CATEGORIES}
          onPress={cellOnPressed}
        />
        <SeparatorView />
        <CellDetail
          title={language('profileGeneral.careerStrengths')}
          description={careerStrengthsString}
          type={CELL_ENUM.CAREER_STRENGTHS}
          onPress={cellOnPressed}
        />
        <SeparatorView />
        <CellDetail
          title={language('profileGeneral.interests')}
          description={interestsString}
          type={CELL_ENUM.INTERESTS}
          onPress={cellOnPressed}
        />
        <SeparatorView />
        {/*<CompanyView />*/}
        <CellDetail
          title={language('profileGeneral.company')}
          isTextTransform={false}
          description={companyName}
          type={CELL_ENUM.COMPANY}
          onPress={cellOnPressed}
        />
        <SeparatorView />
        {/*<JobTitleView />*/}
        <CellDetail
          title={language('profileGeneral.jobTitle')}
          isTextTransform={false}
          description={jobName}
          type={CELL_ENUM.JOB_TITLE}
          onPress={cellOnPressed}
        />
        <SeparatorView />
        <CellDetail title={language('profileGeneral.school')} description={schoolName} type={CELL_ENUM.SCHOOL} onPress={cellOnPressed} />
        <SeparatorView />
        <CellDetail
          title={language('profileGeneral.lingvingIn')}
          description={cityDescription}
          type={CELL_ENUM.LIVING_IN}
          onPress={cellOnPressed}
          isTextTransform={false}
        />
        <SeparatorView />
        <CellDetail
          title={language('profileGeneral.iSpeakTheseLanguages')}
          description={languagesString}
          type={CELL_ENUM.LANGUAGE}
          onPress={cellOnPressed}
        />
        <SeparatorView />
      </View>
    </View>
  );
}

export default React.memo(BodyView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  wrapperAddImageView: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },

  wrapperPreviewProfileButton: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
  },

  wrapperDetailInfo: {
    padding: 15,
    marginVertical: 20,
    backgroundColor: colors.gray_50,
  },
});
