import { useNavigation } from '@react-navigation/native';
import {
  createOrEditLeadClear,
  createOrEditLeadHandle,
  getLeadDetailHandle
} from '../../../redux/actions/lead';
import { getShowAlertError } from '../../../redux/actions/system';
import { LEAD } from '../../../redux/actionsType';
import { AppLoading, DynamicInputForm, FloatFooter, PrimaryButton } from '../../../components/';
import { CANNOT_CREATE_LEAD, CANNOT_UPDATE_LEAD } from '../../../constants/errors';
import { CREATE_LEAD_SUCCESSFULLY, UPDATE_LEAD_SUCCESSFULLY } from '../../../constants/success';
import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SafeAreaView from 'react-native-safe-area-view';
import { useDispatch, useSelector } from 'react-redux';
import { getLoadingSelector } from '../../../redux/selectors/loading';
import { styles } from './styles';
import { useEmptyForm } from '../../../hooks/useEmptyForm';
import { emitEvent } from '../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../global/app';

const CreateOrEditLead = props => {
  const item = props.route?.params?.item;
  const navigation = useNavigation();
  const leadDetail = useSelector(state => state.lead.lead);
  const memberId = useSelector(state => state.auth.memberId);
  const isLoading = useSelector(state => getLoadingSelector(state, [LEAD.GET_LEAD_DETAIL.HANDLER]));
  const createSuccess = useSelector(state => state.lead.createEditLeadSuccess);
  const [lead, setLead] = useState(null);
  const dispatch = useDispatch();

  // const onPressCreateSupport = useCallback(() => {
  //   navigation.navigate('CreateSupportScreen');
  // }, [navigation]);

  // const onCall = useCallback(() => {
  //   let phoneNumber = `tel:${item?.phone}`;
  //   Linking.canOpenURL(phoneNumber)
  //     .then(supported => {
  //       if (!supported) {
  //         // show popup error
  //       } else {
  //         return Linking.openURL(phoneNumber);
  //       }
  //     })
  //     .catch(err => {});
  // }, [item?.phone]);

  // const onMessage = useCallback(() => {
  //   let phoneNumber = `sms:${item?.phone}`;
  //   Linking.canOpenURL(phoneNumber)
  //     .then(supported => {
  //       if (!supported) {
  //         // show popup error
  //       } else {
  //         return Linking.openURL(phoneNumber);
  //       }
  //     })
  //     .catch(err => {});
  // }, [item?.phone]);

  // const onCreateSchedule = useCallback(() => {
  //   navigation.navigate('CreateScheduleScreen', {
  //     reference: item,
  //     scheduleType: ScheduleType.LEAD
  //   });
  // }, [navigation, item]);

  // const LeadInformation = useMemo(() => {
  //   if (item?.id > 0) {
  //     return (
  //       <>
  //         <View style={styles.headerContainer}>
  //           <View style={styles.topHeader}>
  //             <Heading>{lead?.name || item?.name}</Heading>
  //           </View>
  //           <Divider />
  //           <View style={styles.bottomHeader}>
  //             <SubHead translate  color={TEXT_COLOR.GreenBold}>
  //               {'lead_detail.contact_to_customer'}
  //             </SubHead>

  //             <View style={styles.iconArea}>
  //               <TouchableOpacity onPress={onCreateSchedule}>
  //                 <ICCalendarBlank />
  //               </TouchableOpacity>
  //               <TouchableOpacity onPress={onCall}>
  //                 <ICPhoneCall />
  //               </TouchableOpacity>
  //               <TouchableOpacity onPress={onMessage}>
  //                 <ICEnvelop />
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         </View>
  //         <View style={styles.groupCallSupport}>
  //           <TouchableOpacity onPress={onPressCreateSupport}>
  //             <SubHead translate  bold={false} color={TEXT_COLOR.GreenLight}>
  //               {'loan_calc.request_support'}
  //             </SubHead>
  //           </TouchableOpacity>
  //         </View>
  //       </>
  //     );
  //   }
  //   return null;
  // }, [item?.id, item?.name, lead?.name, onPressCreateSupport, onCall, onCreateSchedule, onMessage]);

  useEffect(() => {
    navigation.setOptions({
      title: item?.id > 0 ? 'screen_name.update_lead' : 'screen_name.create_lead'
    });
    dispatch(getLeadDetailHandle({ params: { entityId: item?.id } }));
    return () => {};
  }, [dispatch, item, navigation]);

  useEffect(() => {
    setLead(leadDetail);
    return () => {};
  }, [leadDetail]);

  useEffect(() => {
    return () => {};
  }, [lead]);

  useEffect(() => {
    if (createSuccess) {
      item?.id > 0
        ? dispatch(getShowAlertError(UPDATE_LEAD_SUCCESSFULLY))
        : dispatch(getShowAlertError(CREATE_LEAD_SUCCESSFULLY));
      navigation.goBack();
      emitEvent({
        event_name: item?.id > 0 ? SDK_EVENT_NAME.LEAD_UPDATE : SDK_EVENT_NAME.LEAD_CREATE,
        data: item
      });
      dispatch(createOrEditLeadClear());
    } else if (createSuccess === false) {
      item?.id > 0
        ? dispatch(getShowAlertError(CANNOT_UPDATE_LEAD))
        : dispatch(getShowAlertError(CANNOT_CREATE_LEAD));
    }
    return () => {};
  }, [createSuccess, navigation, item, dispatch]);

  const onChange = listComponent => {
    setLead(pre => {
      return { ...pre, listComponent };
    });
  };

  const onCreate = () => {
    const leadObj = {
      ...lead,
      memberId
    };
    dispatch(createOrEditLeadHandle({ params: leadObj }));
  };

  const isFillAll = useEmptyForm(lead?.listComponent);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <AppLoading loading />
      ) : (
        <>
          <KeyboardAwareScrollView
            extraHeight={80}
            keyboardOpeningTime={-1}
            enableResetScrollToCoords={false}
            contentContainerStyle={styles.wrapper}
            showsVerticalScrollIndicator={false}>
            {/* {LeadInformation} */}
            <DynamicInputForm
              listComponent={lead?.listComponent}
              onChange={onChange}
              style={styles.formContainer}
            />
          </KeyboardAwareScrollView>

          <FloatFooter style={styles.action}>
            <PrimaryButton
              translate
              title={item?.id > 0 ? 'common.save' : 'lead.create_lead'}
              onPress={onCreate}
              disabled={!isFillAll}
            />
          </FloatFooter>
        </>
      )}
    </SafeAreaView>
  );
};

export default CreateOrEditLead;
