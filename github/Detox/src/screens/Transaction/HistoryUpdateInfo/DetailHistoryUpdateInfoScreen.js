import {isEqual, reduce} from 'lodash-es';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useGetCustomerInfoChangeHistoryByIdForFoLazyQuery} from '../../../api/graphql/generated/graphql';
import {FETCH_POLICY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal, small} from '../../../assets/theme/metric';
import BaseScreen from '../../../components/BaseScreen';
import {getGenderText} from '../../../utils/MappingMasterData';
import {dateToString, getTextDateFromTimeStamp} from '../../../utils/TimerCommon';
import {useMount} from '../../commonHooks';
import {parsePlaceToString} from '../../Profile/CreateEditProfile/BasicAgentProfileComponent';

const styles = StyleSheet.create({
  viewContain: {
    margin: normal,
    flex: 1,
  },
  viewInfo: {flexDirection: 'row', flexShrink: 1, flexWrap: 'wrap', marginTop: normal},
  textInfo: {color: COLORS.GRAY_97, fontSize: 14, flex: 1, ...FONTS.regular},
  viewText: {flex: 2},
});

const listFullFill = [
  'fullName',
  'dob',
  'gender',
  'nationalId',
  'nationalIdType',
  'nationalIdIssueDate',
  'nationalIdIssuePlace',
  'permanentAddress',
  'contactAddress',
  'phone',
  'email',
];
const listTranslate = {
  fullName: translate('common.customer'),
  dob: translate(STRINGS.DAY_OF_BIRTH),
  gender: translate(STRINGS.GENDER),
  nationalId: translate(STRINGS.IDENTIFY),
  nationalIdType: translate('common.identifyType'),
  nationalIdIssueDate: translate(STRINGS.ID_ISSUE_DATE),
  nationalIdIssuePlace: translate(STRINGS.ID_ISSUE_PLACE),
  permanentAddress: translate(STRINGS.PERMANENT_ADDRESS),
  contactAddress: translate(STRINGS.CONTACT_ADDRESS),
  phone: translate('common.phone'),
  email: translate('common.email'),
};

const TextTitleInfo = ({title, newValue = false, des}) => {
  return (
    <View style={styles.viewInfo}>
      <Text style={styles.textInfo}>{title}</Text>
      <View style={styles.viewText}>
        <Text style={{color: COLORS.BLACK_33, ...FONTS.regular}}>{des}</Text>
        {newValue && <Text style={{color: COLORS.STATE_ERROR, ...FONTS.regular}}>{newValue}</Text>}
      </View>
    </View>
  );
};

const mapData = dataField => {
  if (dataField) {
    const data = JSON.parse(dataField);
    const field = {
      fullName: data?.fullName,
      dob: dateToString(data?.dob),
      gender: getGenderText(data?.gender),
      nationalId: data?.nationalId,
      nationalIdType: data?.nationalIdType.toUpperCase(),
      nationalIdIssueDate: getTextDateFromTimeStamp(data?.nationalIdIssueDate),
      nationalIdIssuePlace: data?.nationalIdIssuePlace,
      permanentAddress: parsePlaceToString(data?.permanentAddress),
      contactAddress: parsePlaceToString(data?.contactAddress),
      phone: data?.phone,
      email: data?.email,
    };
    return field;
  }
};

const DetailHistoryUpdateInfoScreen = ({route}) => {
  const {id} = route?.params;
  const [execute, {data}] = useGetCustomerInfoChangeHistoryByIdForFoLazyQuery({
    notifyOnNetworkStatusChange: true,
    ...FETCH_POLICY.CACHE_AND_NETWORK,
  });

  useMount(() => {
    execute({
      variables: {
        id: id,
      },
    });
  });

  const RenderInfoView = () => {
    if (data) {
      const oldData = mapData(
        data?.getCustomerInfoChangeHistoryByIdForFO?.customerInfoChangeHistoryDto?.oldData,
      );
      const newData = mapData(
        data?.getCustomerInfoChangeHistoryByIdForFO?.customerInfoChangeHistoryDto?.newData,
      );
      const listFieldUpdate = reduce(
        oldData,
        function (result, value, key) {
          return isEqual(value, newData[key]) ? result : result.concat(key);
        },
        [],
      );
      return listFullFill.map(item => {
        const isCheck = listFieldUpdate.includes(item);
        return (
          <TextTitleInfo
            key={item}
            title={`${listTranslate[item]}: `}
            newValue={isCheck ? newData[item] : false}
            des={oldData[item]}
          />
        );
      });
    }
    return <></>;
  };
  return (
    <BaseScreen title={translate('transaction.updateInfo.title')}>
      <View style={{marginHorizontal: normal, ...HELPERS.rowStartCenter}}>
        <Icon name={'error'} color={COLORS.STATE_ERROR} size={15} style={{marginRight: small}} />
        <Text style={{color: COLORS.STATE_ERROR, ...FONTS.regular}}>
          {translate('transaction.updateInfo.title')}
        </Text>
      </View>
      <ScrollView style={styles.viewContain}>{data && <RenderInfoView />}</ScrollView>
    </BaseScreen>
  );
};

export default DetailHistoryUpdateInfoScreen;
