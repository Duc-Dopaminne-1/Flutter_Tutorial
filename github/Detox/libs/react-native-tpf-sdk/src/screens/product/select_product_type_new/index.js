import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import { getInfoServiceHandle, getListTriggerHandle } from '../.././../redux/actions/masterData';
import GroupService from '../../../components/group_service';
import Indicator from '../../../components/ball_indicator';
import SCREENS_NAME from '../../../constants/screens';
import { setLeadContactForCredit } from '../.././../redux/actions/credit';
import { setLeadContactForInsurance } from '../.././../redux/actions/insurance';
import { setLeadContactForExtraService } from '../.././../redux/actions/extraService';

const triggerType = 1;

const SelectProductType = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { leadId, contactId } = props.route?.params || {};
  const { infoService, listTrigger } = useSelector(state => state.masterData);
  const dataInfoService = infoService?.data;
  const dataListTrigger = listTrigger?.data;

  useEffect(() => {
    dispatch(getInfoServiceHandle());
    dispatch(getListTriggerHandle({ params: { TriggerType: triggerType } }));
  }, []);

  const selectService = useCallback(service => {
    let triggerCode = service?.triggerCode;
    if (triggerCode) {
      // product_trigger
      let routeName = SCREENS_NAME.TRIGGER_FLOW_SCREEN;
      const params = { triggerCode };
      setServiceDetail(service?.productType);
      navigation.navigate(routeName, params);
    }
  }, []);

  const setServiceDetail = type => {
    switch (type) {
      case 1:
        dispatch(setLeadContactForCredit({ leadId, contactId }));
        break;
      case 2:
        dispatch(setLeadContactForInsurance({ leadId, contactId }));
      case 3:
        dispatch(setLeadContactForExtraService({ leadId, contactId }));
        break;
      default:
        break;
    }
  };

  if (infoService.loading || listTrigger.loading) {
    return (
      <View style={styles.createContactProfileWrapper}>
        <Indicator />
      </View>
    );
  }
  return (
    <View style={styles.createContactProfileWrapper}>
      <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
        <GroupService
          horizontal
          data={dataListTrigger}
          onPress={selectService}
          dataInfoService={dataInfoService}
        />
      </ScrollView>
    </View>
  );
};

export default React.memo(SelectProductType);
