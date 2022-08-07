import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {APPROVAL_STATUS} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {Message} from '../../../../assets/localize/message/Message';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import InputSection from '../../../../components/InputSection';
import KeyboardScrollView from '../../../../components/KeyboardScrollView';
import {getPropertyPostApprovalStatusByKeyArr} from '../../../../utils/GetMasterData';
import ScreenIds from '../../../ScreenIds';
import {CONTACT_ACTIONS, CONTACT_FIELD} from '../../DetailRequestConstant';
import useGetPropertyPosts from '../../hooks/useGetPropertyPosts';
import CreateRequestFooterButtons from './CreateRequestFooterButtons';
import SelectAreaMeasurementDropdownView from './SelectAreaMeasurementDropdownView';
import SelectCitiesAndDistrictView from './SelectCitiesAndDistrictView';
import SelectDirectionDropdownView from './SelectDirectionDropdownView';
import SelectLocationTypeView from './SelectLocationTypeView';
import SelectPriceRangeDropdownView from './SelectPriceRangeDropdownView';
import SelectProjectDropdownView from './SelectProjectDropdownView';
import SelectPropertyTypeView from './SelectPropertyTypeView';

const styles = StyleSheet.create({
  bodyContainer: {
    flexGrow: 1,
  },
  postIdInputContainer: {
    ...commonStyles.input,
    ...HELPERS.row,
    justifyContent: 'space-between',
  },
  postIdInput: {
    ...HELPERS.fill,
    paddingRight: 8,
  },
  postIdValidateButton: {
    width: 70,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_BERMUDA,
    borderRadius: 5,
    ...HELPERS.center,
    ...METRICS.microPaddingVertical,
    alignSelf: 'center',
  },
  textPostIdValidate: {
    ...FONTS.regular,
    ...FONTS.fontSize14,
    lineHeight: 20,
    color: COLORS.GREY_BERMUDA,
  },
  inputTitle: {
    ...FONTS.regular,
    ...commonStyles.txtFontSize14,
    color: COLORS.BRAND_GREY,
  },
});

const getPropertyPostQueryVariables = (postCode, masterData) => {
  const approvalStatus = getPropertyPostApprovalStatusByKeyArr(masterData, [
    APPROVAL_STATUS.APPROVAL,
  ]);
  const statusIds = approvalStatus.map(status => status.propertyPostApprovalStatusId);
  const searchCriteria = {
    variables: {
      where: {propertyCode: postCode?.toUpperCase(), propertyPostApprovalStatusId_in: statusIds},
    },
  };
  return searchCriteria;
};

const CreateContactRequestContainer = ({
  state,
  dispatch,
  errors,
  masterData,
  handleOnPressNext,
  handleOnPressCancel,
  validateInputs,
}) => {
  const navigation = useNavigation();
  const [postCodeError, setPostCodeError] = useState('');

  // ********* Handle get property post info *********
  const onDoneGetPropertyPosts = propertyPost => {
    if (propertyPost) {
      navigation.navigate(ScreenIds.ViewPropertyPost, {
        propertyPostId: propertyPost?.propertyPostId,
        viewByOtherMode: true,
      });
    } else {
      setPostCodeError(Message.CCT_MSG_001);
    }
  };
  const [startGetPropertyPosts] = useGetPropertyPosts({
    onSuccess: onDoneGetPropertyPosts,
    contactType: state.contactType,
  });
  const handleOnPressValidatePostId = () => {
    if (state?.postCode) {
      startGetPropertyPosts(getPropertyPostQueryVariables(state.postCode, masterData));
    }
  };

  const setFieldInfo = (fieldName, value) => {
    dispatch({
      type: CONTACT_ACTIONS.FIELD,
      [CONTACT_FIELD.fieldName]: fieldName,
      payload: value,
    });
  };

  const setLocation = value => {
    setFieldInfo(CONTACT_FIELD.location, value?.title);
  };

  const setPostCode = value => {
    setFieldInfo(CONTACT_FIELD.postCode, value);
    setPostCodeError('');
  };

  const updateFieldsAndErrors = (field, item) => {
    setFieldInfo(`${field}`, item);
    const updateState = {...state};
    updateState[field] = item;
    validateInputs(updateState);
  };

  const onChangeTextFromPrice = priceString => {
    const newInterestedPrice = {
      ...state?.interestedPrice,
      fromValue: priceString,
    };
    updateFieldsAndErrors(CONTACT_FIELD.interestedPrice, newInterestedPrice);
  };

  const onChangeTextToPrice = priceString => {
    const newInterestedPrice = {
      ...state?.interestedPrice,
      toValue: priceString,
    };
    updateFieldsAndErrors(CONTACT_FIELD.interestedPrice, newInterestedPrice);
  };

  const onChangeTextFromArea = areaString => {
    const newAreaMeasurement = {
      ...state?.areaMeasurement,
      fromValue: areaString,
    };
    updateFieldsAndErrors(CONTACT_FIELD.areaMeasurement, newAreaMeasurement);
  };

  const onChangeTextToArea = areaString => {
    const newAreaMeasurement = {
      ...state?.areaMeasurement,
      toValue: areaString,
    };
    updateFieldsAndErrors(CONTACT_FIELD.areaMeasurement, newAreaMeasurement);
  };

  const onSelectPropertyPostTypeId = item => {
    setFieldInfo(CONTACT_FIELD.propertyPostTypeId, item?.id);
  };

  const onSelectProject = item => {
    setFieldInfo(CONTACT_FIELD.project, item);
  };

  const onSelectCity = item => {
    updateFieldsAndErrors(CONTACT_FIELD.interestedCity, item);
    setFieldInfo(CONTACT_FIELD.interestedDistrict, {});
  };

  const onSelectDistrict = item => {
    updateFieldsAndErrors(CONTACT_FIELD.interestedDistrict, item);
  };

  const onSelectInterestedPrice = item => {
    updateFieldsAndErrors(CONTACT_FIELD.interestedPrice, item);
  };

  const onSelectAreaMeasurement = item => {
    updateFieldsAndErrors(CONTACT_FIELD.areaMeasurement, item);
  };

  const onSelectDirections = item => {
    setFieldInfo(CONTACT_FIELD.direction, item);
  };

  return (
    <KeyboardScrollView contentStyle={styles.bodyContainer}>
      <View style={METRICS.horizontalPadding}>
        <InputSection
          headerTitle={translate(STRINGS.POST_ID)}
          headerStyles={styles.inputTitle}
          placeholder={translate(STRINGS.ENTER_POST_ID_FOR_SEARCHING)}
          inputContainerStyle={styles.postIdInputContainer}
          inputStyle={styles.postIdInput}
          value={state.postCode}
          error={postCodeError}
          editable={true}
          onChangeText={setPostCode}
          customRightComponent={
            <TouchableOpacity
              style={styles.postIdValidateButton}
              onPress={handleOnPressValidatePostId}>
              <Text style={styles.textPostIdValidate}>{translate(STRINGS.VALIDATE)}</Text>
            </TouchableOpacity>
          }
        />
        <View style={commonStyles.separatorRow16} />
        <SelectPropertyTypeView
          onSelected={onSelectPropertyPostTypeId}
          defaultPropertyTypeId={state?.propertyPostTypeId}
        />
        <View style={commonStyles.separatorRow24} />
        <SelectProjectDropdownView onSelectedProject={onSelectProject} project={state?.project} />
        <View style={commonStyles.separatorRow24} />
        <SelectCitiesAndDistrictView
          cityValidationErrorCode={errors?.city ?? ''}
          districtValidationErrorCode={errors?.district ?? ''}
          onSelectedCity={onSelectCity}
          onSelectedDistrict={onSelectDistrict}
          defaultCity={state.interestedCity}
          defaultDistrict={state.interestedDistrict}
        />
        <View style={commonStyles.separatorRow24} />
        <SelectPriceRangeDropdownView
          contactType={state.contactType}
          onSelectedPrice={onSelectInterestedPrice}
          onChangeTextFromPrice={onChangeTextFromPrice}
          onChangeTextToPrice={onChangeTextToPrice}
          chosenItemId={state?.interestedPrice?.id}
          errors={errors}
        />
        <View style={commonStyles.separatorRow24} />
        <SelectAreaMeasurementDropdownView
          onSelected={onSelectAreaMeasurement}
          chosenItemId={state?.areaMeasurement?.id}
          errors={errors}
          onChangeTextFromArea={onChangeTextFromArea}
          onChangeTextToArea={onChangeTextToArea}
        />
        <View style={commonStyles.separatorRow24} />
        <SelectDirectionDropdownView
          onSelected={onSelectDirections}
          directions={state?.direction}
        />
        <View style={commonStyles.separatorRow24} />
        <SelectLocationTypeView onSelected={setLocation} location={state.location} />
        <View style={commonStyles.separatorRow24} />
      </View>
      <View
        style={[
          commonStyles.footerContainerStyle,
          commonStyles.shadowApp,
          HELPERS.rowSpaceBetween,
        ]}>
        <CreateRequestFooterButtons
          onPressCancel={handleOnPressCancel}
          onPressNext={handleOnPressNext}
        />
      </View>
    </KeyboardScrollView>
  );
};

export default CreateContactRequestContainer;
