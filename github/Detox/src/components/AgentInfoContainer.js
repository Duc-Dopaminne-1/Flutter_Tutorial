/* eslint-disable react-hooks/exhaustive-deps */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useState} from 'react';
import {Keyboard, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {AppContext} from '../appData/appContext/useAppContext';
import {
  CONSTANTS,
  GLOBAL_ACTIONS,
  IDENTIFY_TYPE,
  KEY_BOARD_TYPE,
  MAX_LENGTH,
} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {medium, METRICS, normal} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import ErrorText from '../components/ErrorText';
import InputSection from '../components/InputSection';
import KeyboardScrollView from '../components/KeyboardScrollView';
import RequiredLabel from '../components/RequiredLabel';
import {useAgreePolicy} from '../hooks/useAgreePolicy';
import {useGetAvatar} from '../hooks/useGetAvatar';
import {useTopenerBank} from '../hooks/useTopenerBank';
import InterestedPropertyContainer from '../screens/Auth/RegisterAgent/components/InterestedPropertyContainer';
import {ViewInfoIdentify} from '../screens/BookingDeposit/Confirm/Components/IDInfo';
import {callAfterInteraction, useMount} from '../screens/commonHooks';
import {CardTopenerBank} from '../screens/Profile/components/CardTopenerBank';
import {ModalCreateEditBank} from '../screens/Profile/CreateEditProfile/ModalCreateEditBank';
import SubmitAgentInfoComponent from '../screens/Profile/CreateEditProfile/SubmitAgentInfoComponent';
import {AgentInfoState} from '../screens/Profile/CreateEditProfile/types';
import {useGetDefaultAgentGroup} from '../screens/Profile/useGetAgentGroups';
import CustomButton from './Button/CustomButton';
import CustomCheckbox from './Checkbox/CustomCheckbox';
import CitiesDistrictsWards from './CitiesDistrictsWards';
import CitiesDistrictsWardsContact from './CitiesDistrictsWardsContact';
import InterestedAreaContainer from './DropDown/InterestedAreaContainer';
import {InputButton} from './InputButton';
import {PolicyModal} from './Modal/PolicyModal';
import RadioSelectionsView, {ITEM_TYPE} from './RadioSelectionsView';
import {SizeBox} from './SizeBox';
import RangeSlider2 from './Slider/RangeSlider2';

const ViewSuggestUpdateInfo = () => {
  return (
    <View style={styles.wrapperSuggest}>
      <Ionicons name="alert-circle" color={COLORS.BLUE_BASIC} size={24} />
      <SizeBox width={SIZES.SEPARATOR_12} />
      <Text style={styles.txtSuggest}>{translate('agent.suggestUpdateInfo')}</Text>
    </View>
  );
};

export const getCities = (data, city) => {
  return data?.cities?.edges
    ? data.cities.edges.map(item => ({
        id: item.cityId,
        name: item.cityName,
        checked: item.cityId === city?.id ? true : false,
      }))
    : [];
};

const getSelectedItem = (item, values) => {
  if (!values) {
    return false;
  }
  for (const value of values) {
    if (item.propertyTypeId === value.id) {
      return true;
    }
  }
  return false;
};
export const getPreferPropertyTypes = (data, properties) => {
  if (!properties) {
    return [];
  }

  if (data?.propertyTypes?.edges) {
    return data.propertyTypes.edges.map(item => ({
      id: item.propertyTypeId,
      name: item.propertyTypeName,
      description: item.propertyTypeDescription,
      checked: getSelectedItem(item, properties),
    }));
  }
  return [];
};

const Section = ({title, children, onPressEdit}) => {
  return (
    <View style={styles.wrapperSection}>
      <View style={styles.wrapperTitleSection}>
        <Text style={styles.titleSection}>{title}</Text>
        {!!onPressEdit && (
          <>
            <SizeBox width={SIZES.SEPARATOR_12} />
            <TouchableOpacity onPress={onPressEdit}>
              <SizeBox height={SIZES.SEPARATOR_8} />
              <Text style={{...FONTS.bold, fontSize: SIZES.FONT_14, color: COLORS.PRIMARY_A100}}>
                {translate('common.edit')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <SizeBox height={SIZES.SEPARATOR_16} />
      {children}
    </View>
  );
};
const SubSection = ({title, subTitle, children}) => {
  return (
    <View style={styles.wrapperSubSection}>
      <Text style={styles.titleSubSection}>{title}</Text>
      <SizeBox height={SIZES.SEPARATOR_8} />
      {subTitle && (
        <>
          <Text style={styles.subTitleSubSection}>{subTitle}</Text>
          <SizeBox height={SIZES.SEPARATOR_8} />
        </>
      )}
      {children}
    </View>
  );
};

export type AgentInfoContainerProps = {
  state: AgentInfoState,
};

const AgentInfoContainer = ({
  state,
  dispatch,
  errors,
  onIdTextChanged,
  onPhotoChanged,
  onAddressTextChanged,
  onPriceInterestedChanged,
  onReferralCodeTextChanged,
  onAgentCodeChanged,
  requestChangeAccountCode,
  onContactAddressTextChanged,
  onChangeIdentifyDate,
  onChangeIdentifyPlace,
  onSubmit,
  isEditRefCode,
  isEdit,
}: AgentInfoContainerProps) => {
  const [areaCities, setAreaCities] = useState([]);
  const [addressCities, setAddressCities] = useState([]);
  const [contactCities, setContactCities] = useState([]);
  const [agentGroups, setAgentGroups] = useState([]);
  const [agentType, setAgentType] = useState({});
  const [isEditAccountCode, setIsEditAccountCode] = useState(false);
  const [accountCode, setAccountCode] = useState(state.initialAccountCode);
  const agreePolicy = useAgreePolicy('TopenerPolicy');
  const topenerBank = useTopenerBank();
  const {listTopenerBanks, deleteBank} = topenerBank;
  const {getMasterData, state: appState} = useContext(AppContext);
  const masterData = getMasterData();
  const {getAvatar} = useGetAvatar(onPhotoChanged);
  const {
    errArea,
    errProperty,
    // errTeam,
    errNationId,
    errContactAddress,
    errAddress,
    errReferral,
    errNationalIdIssueDate,
    errNationalIdIssuePlace,
    errNationalIdType,
  } = errors;
  // const onSuccessGetAgentGroups = agentGroupsLevel1 => {
  //   callAfterInteraction(() => {
  //     const groupList = agentGroupsLevel1?.edges ?? [];
  //     setAgentGroups(getAgentGroups(groupList, state.agentGroup));
  //   });
  // };
  // const {getAgentGroupsLevel1} = useGetAgentGroups({
  //   onSuccess: onSuccessGetAgentGroups,
  //   showSpinner: false,
  // });
  const {getDefaultAgentGroup} = useGetDefaultAgentGroup({
    onSuccess: group => {
      setAgentType(group);
    },
  });

  function loadAgentGroups() {
    // when create agent => only allows list of groups level 1
    if (!isEdit) {
      // getAgentGroupsLevel1();
      getDefaultAgentGroup();
    } else {
      // not allow mobile user to modify agent group -> only display current info
      setAgentGroups([{id: state.agentGroup?.id, name: state.agentGroup?.name, checked: true}]);
    }
  }
  function loadData() {
    loadAgentGroups();
    !isEdit && getAvatar();
    loadCitiesDistricts();
  }

  useMount(loadData);

  useEffect(() => {
    if (agentType.id) {
      dispatch({type: GLOBAL_ACTIONS.SET_AGENT_TYPE, payload: agentType});
    }
  }, [agentType.id]);
  useEffect(() => {
    if (appState.isOnline && isEmpty(agentGroups)) {
      loadData();
    }
  }, [appState.isOnline]);

  function loadCitiesDistricts() {
    if (masterData) {
      setAreaCities(getCities(masterData, {}));
      setAddressCities(getCities(masterData, state.permanentAddress?.city));
      setContactCities(getCities(masterData, state.contactAddress?.city));
      dispatch({
        type: GLOBAL_ACTIONS.SET_PREFER_PROPERTY_TYPES,
        payload: getPreferPropertyTypes(masterData, state.preferPropertyTypes),
      });
    }
  }

  const onPressAccountCodeButton = () => {
    if (isEditAccountCode) {
      Keyboard.dismiss();
      setIsEditAccountCode(false);
      callAfterInteraction(() => {
        requestChangeAccountCode(accountCode);
      });
    } else {
      setIsEditAccountCode(true);
    }
  };

  const onPressSubmit = () => {
    setIsEditAccountCode(false);
    onSubmit();
  };

  const onChangeIdentificationType = type => {
    dispatch({type: GLOBAL_ACTIONS.SET_IDENTIFYCATION_TYPE, payload: type.value});
  };

  const onCheckReceivedCrawler = value => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'allowedCrawler', payload: value});
  };
  const onPressCopyAddress = () => {
    const listCities = cloneDeep(addressCities);
    setContactCities(listCities);
    dispatch({type: GLOBAL_ACTIONS.SET_COPY_SAME_ADDRESS, payload: state?.permanentAddress});
  };
  return (
    <>
      <KeyboardScrollView extraScrollHeight={CONSTANTS.EXTRA_KEYBOARD_SCROLL_FOR_HEADER}>
        {!state.isCompletedProfile && <ViewSuggestUpdateInfo />}
        <View style={styles.body}>
          {isEdit ? (
            <InputSection
              headerTitle={translate(STRINGS.AGENT_CODE)}
              placeholder={translate(STRINGS.AGENT_CODE)}
              onChangeText={onAgentCodeChanged}
              value={state.agentCode}
              editable={false}
            />
          ) : (
            <></>
          )}
          <RequiredLabel
            title={translate(STRINGS.PERMANENT_ADDRESS)}
            titleStyle={[styles.labelInterestedArea, {marginTop: isEdit ? normal : medium}]}
            isRequired={false}
          />
          <CitiesDistrictsWards
            state={state}
            dispatch={dispatch}
            cities={addressCities}
            errors={errors}
          />
          <InputSection
            headerTitle={translate(STRINGS.PERMANENT_ADDRESS_PLACEHOLDER)}
            onChangeText={onAddressTextChanged}
            customStyle={{...METRICS.marginTop}}
            inputStyle={commonStyles.inputBorder}
            value={state.permanentAddress?.street}
            maxLength={MAX_LENGTH.default}
            error={errAddress}
          />
          <RequiredLabel
            textRight={translate('project.confirmTransaction.copyPermanentAddressTitle')}
            title={translate(STRINGS.CONTACT_ADDRESS)}
            rightAction={onPressCopyAddress}
            titleStyle={[styles.labelInterestedArea, {marginTop: isEdit ? normal : medium}]}
            isRequired={true}
          />
          <CitiesDistrictsWardsContact
            state={state}
            dispatch={dispatch}
            cities={contactCities}
            errors={errors}
          />
          <InputSection
            headerTitle={translate(STRINGS.PERMANENT_ADDRESS_PLACEHOLDER)}
            onChangeText={onContactAddressTextChanged}
            customStyle={{...METRICS.marginTop}}
            inputStyle={commonStyles.inputBorder}
            value={state.contactAddress?.street}
            maxLength={MAX_LENGTH.default}
            error={errContactAddress}
          />
          <Section title={translate('agent.bank.infoBank')}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
              {listTopenerBanks?.map(item => (
                <CardTopenerBank
                  item={item}
                  onPressDeleteBank={() => {
                    deleteBank(item);
                  }}
                  onPressEditBank={() => {
                    topenerBank.openModal(item);
                  }}
                  onChangeDefaultBank={() => {
                    topenerBank.onChangeDefaultBank(item);
                  }}
                />
              ))}
            </ScrollView>
            <SizeBox height={SIZES.SEPARATOR_16} />
            {listTopenerBanks?.length < 5 && (
              <CustomButton
                mode="outline"
                title={translate('agent.bank.button.addBank')}
                borderStyle="dashed"
                leftChild={
                  <MaterialCommunityIcons
                    name="plus-circle"
                    size={SIZES.SEPARATOR_24}
                    color={COLORS.PRIMARY_A100}
                  />
                }
                onPress={() => {
                  topenerBank.openModal();
                }}
              />
            )}
          </Section>
          <SubSection
            title={translate('common.interested_area')}
            subTitle={translate('common.des_interested_area')}>
            <InterestedAreaContainer state={state} dispatch={dispatch} cities={areaCities} />
            <ErrorText errorText={errArea} />
            <RangeSlider2
              title={translate(STRINGS.INTERESTED_PRICE)}
              headerStyle={styles.titleSubSection}
              isRequired={false}
              values={[state.preferPropertyPriceFrom, state.preferPropertyPriceTo]}
              unit={translate(STRINGS.BILLION)}
              max={CONSTANTS.MAX_PRICE_SLIDER}
              onValuesChangeFinish={onPriceInterestedChanged}
            />
            <SizeBox height={SIZES.SEPARATOR_16} />
            <RadioSelectionsView
              data={IDENTIFY_TYPE}
              isRequired
              initValue={state?.nationalIdType}
              headerTitle={translate('common.identifyType')}
              headerStyle={styles.titleSubSection}
              type={ITEM_TYPE.DEFAULT}
              onChosen={onChangeIdentificationType}
              customStyle={{marginBottom: normal}}
              error={errNationalIdType}
            />
            <InputSection
              inputStyle={commonStyles.inputBorder}
              headerTitle={translate(STRINGS.IDENTIFY)}
              placeholder={translate(STRINGS.IDENTIFY)}
              onChangeText={onIdTextChanged}
              keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
              value={state.nationalId}
              isRequired={true}
              error={errNationId}
            />
            <ViewInfoIdentify
              issueDate={state?.nationalIdIssueDate}
              errorDate={errNationalIdIssueDate}
              updateDate={date => {
                onChangeIdentifyDate && onChangeIdentifyDate(date.getTime());
              }}
              updatePlace={text => {
                onChangeIdentifyPlace && onChangeIdentifyPlace(text);
              }}
              errorPlace={errNationalIdIssuePlace}
              issuePlace={state?.nationalIdIssuePlace}
            />
            <SizeBox height={SIZES.SEPARATOR_16} />
            <InterestedPropertyContainer
              state={state}
              dispatch={dispatch}
              errorText={errProperty}
              headerStyle={styles.titleSubSection}
            />
          </SubSection>
          {/* <View style={styles.separator} />
          <RequiredLabel
            isRequired={false}
            titleStyle={{...FONTS.bold, color: COLORS.TEXT_DARK_10}}
            title={translate('profile.infoPartnerGroup')}
          />
          <DropdownWithTitle
            inputStyle={commonStyles.inputBorder}
            style={METRICS.smallMarginTop}
            title={translate(STRINGS.AGENT_TEAM)}
            dropdownTitle={translate(STRINGS.AGENT_TEAM)}
            popupTitle={translate(STRINGS.AGENT_TEAM)}
            items={agentGroups}
            showSearchBox={false}
            error={errTeam}
            itemSelected={setAgentType}
            disabled={isEdit}
            isRequired={true}
          /> */}
          <CustomCheckbox
            style={[commonStyles.rowCheckBox, METRICS.marginTopPlus]}
            images={['checkbox', 'checkbox-blank-outline']}
            customCheckedBox
            iconCheckedColor={COLORS.PRIMARY_A100}
            iconColor={COLORS.GRAY_C9}
            shouldGetValueOutSide
            parentCheckedValue={state?.allowedCrawler}
            checkValue={onCheckReceivedCrawler}
            title={translate('propertyPost.crawler.receivePropertyCrawler')}
            textStyle={commonStyles.blackText14}
            titleContainerStyle={HELPERS.fill}
          />
          {/* {isEdit && (
            <>
              <CheckboxList
                itemStyle={[commonStyles.rowCheckBox, METRICS.resetMargin]}
                customCheckedBox
                images={['checkbox', 'checkbox-blank-outline']}
                iconCheckedColor={COLORS.PRIMARY_A100}
                iconColor={COLORS.GRAY_C9}
                title={translate('agent.topenerServiceTypes')}
                items={allTopenerServiceTypes}
                selectedItems={state.topenerServiceTypes}
                isHorizontal={false}
              />
            </>
          )} */}
          <InputSection
            customStyle={{marginVertical: normal}}
            inputStyle={commonStyles.inputBorder}
            headerTitle={translate(STRINGS.REFERRAL_CODE)}
            placeholder={translate(STRINGS.REFERRAL_CODE_PLACEHOLDER)}
            onChangeText={onReferralCodeTextChanged}
            keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
            value={state?.referralCode}
            editable={isEditRefCode}
            error={errReferral}
          />
          {!!state.initialAccountCode && (
            <InputButton
              headerTitle={translate('ACCOUNT_CODE.TITLE')}
              value={accountCode}
              onChangeText={setAccountCode}
              editable={isEditAccountCode}
              buttonTitle={
                isEditAccountCode ? translate('SEND_REQUEST') : translate('ACCOUNT_CODE.EDIT')
              }
              onPress={onPressAccountCodeButton}
            />
          )}
          <SubmitAgentInfoComponent
            showAgreement={!isEdit}
            onSubmit={onPressSubmit}
            submitTitle={isEdit ? translate(STRINGS.UPDATE) : translate(STRINGS.CONFIRM)}
            agreePolicy={agreePolicy}
          />
        </View>
      </KeyboardScrollView>
      <PolicyModal
        modalizeRef={agreePolicy.modalRef}
        withReactModal
        html={agreePolicy.html}
        onPress={agreePolicy.agreeAndCloseModal}
      />
      <ModalCreateEditBank
        modalRef={topenerBank.modalRef}
        listBanks={topenerBank.listBanks}
        state={topenerBank.state}
        onChangeData={topenerBank.onChangeData}
        createBank={topenerBank.createBank}
        updateBank={topenerBank.updateBank}
        isShowOptionDefault={listTopenerBanks.length >= 1}
      />
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: SIZES.PADDING_16,
  },
  labelInterestedArea: {
    ...FONTS.bold,
    color: COLORS.TEXT_DARK_10,
  },
  wrapperSection: {paddingVertical: SIZES.PADDING_24},
  wrapperSubSection: {paddingVertical: SIZES.PADDING_16},
  wrapperTitleSection: {flexDirection: 'row', justifyContent: 'space-between'},
  titleSection: {...FONTS.bold, fontSize: SIZES.FONT_24, flex: 1, color: COLORS.TEXT_DARK_10},
  titleSubSection: {...FONTS.bold, fontSize: SIZES.FONT_20, flex: 1, color: COLORS.TEXT_DARK_10},
  subTitleSubSection: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_DARK_40,
  },
  wrapperSuggest: {
    paddingHorizontal: SIZES.PADDING_16,
    paddingVertical: SIZES.PADDING_8,
    backgroundColor: COLORS.STATE_INFO_BG,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtSuggest: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_10,
    fontSize: SIZES.FONT_14,
    flex: 1,
    lineHeight: SIZES.FONT_14_LINE_HEIGHT,
  },
});

export default AgentInfoContainer;
